# Predicts diseases based on the symptoms entered and selected by the user.
# importing all necessary libraries
import warnings
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from sklearn.model_selection import train_test_split, cross_val_score
from statistics import mean
from nltk.corpus import wordnet 
import requests
from bs4 import BeautifulSoup
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import RegexpTokenizer
from itertools import combinations
from time import time
from collections import Counter
import operator
import math
from Treatment import diseaseDetail
from sklearn.linear_model import LogisticRegression
import pickle

warnings.simplefilter("ignore")

import nltk
# nltk.download('all')

df_comb = pd.read_csv("dis_sym_dataset_comb.csv") # Disease combination
df_norm = pd.read_csv("dis_sym_dataset_norm.csv") # Individual Disease

X = df_norm.iloc[:, 1:]
Y = df_norm.iloc[:, 0:1]

dataset_symptoms = list(X.columns)
# utlities for pre-processing
stop_words = stopwords.words('english')
lemmatizer = WordNetLemmatizer()
splitter = RegexpTokenizer(r'\w+')

# scores

def score_comb():
    X = df_comb.iloc[:, 1:]
    Y = df_comb.iloc[:, 0:1]
    lr = LogisticRegression()
    lr = lr.fit(X, Y)
    return mean(cross_val_score(lr, X, Y, cv=5))

# synonym func

def synonyms(term):
    synonyms = []
    response = requests.get('https://www.thesaurus.com/browse/{}'.format(term))
    soup = BeautifulSoup(response.content,  "html.parser")
    try:
        container=soup.find('section', {'class': 'MainContentContainer'}) 
        row=container.find('div',{'class':'css-191l5o0-ClassicContentCard'})
        row = row.find_all('li')
        for x in row:
            synonyms.append(x.get_text())
    except:
        None
    for syn in wordnet.synsets(term):
        synonyms+=syn.lemma_names()
    return set(synonyms)



def synonymous_symptoms(input_symptoms):
    user_symptoms = str(input_symptoms).lower().split(',')
    # Preprocessing the input symptoms
    processed_user_symptoms=[]
    for sym in user_symptoms:
        sym=sym.strip()
        sym=sym.replace('-',' ')
        sym=sym.replace("'",'')
        sym = ' '.join([lemmatizer.lemmatize(word) for word in splitter.tokenize(sym)])
        processed_user_symptoms.append(sym)
    

    user_symptoms = []
    for user_sym in processed_user_symptoms:
        user_sym = user_sym.split()
        str_sym = set()
        for comb in range(1, len(user_sym)+1):
            for subset in combinations(user_sym, comb):
                subset=' '.join(subset)
                subset = synonyms(subset) 
                str_sym.update(subset)
        str_sym.add(' '.join(user_sym))
        user_symptoms.append(' '.join(str_sym).replace('_',' '))

    found_symptoms = set()
    for idx, data_sym in enumerate(dataset_symptoms):
        data_sym_split=data_sym.split()
        for user_sym in user_symptoms:
            count=0
            for symp in data_sym_split:
                if symp in user_sym.split():
                    count+=1
            if count/len(data_sym_split)>0.5:
                found_symptoms.add(data_sym)
    found_symptoms = list(found_symptoms)   

    return found_symptoms

def other_occuring_symptoms(select_list):
    # Find other relevant symptoms from the dataset based on user symptoms based on the highest co-occurance with the
    # ones that is input by the user
    dis_list = set()
    final_symp = [] 
    counter_list = []
    for symp in select_list:
        final_symp.append(symp)
        dis_list.update(set(df_norm[df_norm[symp]==1]['label_dis']))
    
    for dis in dis_list:
        row = df_norm.loc[df_norm['label_dis'] == dis].values.tolist()
        row[0].pop(0)
        for idx,val in enumerate(row[0]):
            if val!=0 and dataset_symptoms[idx] not in final_symp:
                counter_list.append(dataset_symptoms[idx])

    dict_symp = dict(Counter(counter_list))
    dict_symp_tup = sorted(dict_symp.items(), key=operator.itemgetter(1),reverse=True)     

    return dict_symp_tup

def predict_probability(final_symp):
    sample_x = [0 for x in range(0,len(dataset_symptoms))]
    for val in final_symp:
        print(val)
        sample_x[dataset_symptoms.index(val)]=1 
    
    pickled_model = pickle.load(open('model.pkl', 'rb'))
    prediction = pickled_model.predict_proba([sample_x])

    k = 10
    diseases = list(set(Y['label_dis']))
    diseases.sort()
    topk = prediction[0].argsort()[-k:][::-1]
    # print(topk)
    topk_dict = {}
    # Show top 10 highly probable disease to the user.
    mean_scores = score_comb()
    # print("reached first")
    for idx,t in  enumerate(topk):
        print(idx,t)
        match_sym=set()
        row = df_norm.loc[df_norm['label_dis'] == diseases[t]].values.tolist()
        row[0].pop(0)
        
        for idx1,val in enumerate(row[0]):
            if val!=0:
                match_sym.add(dataset_symptoms[idx1])
        
        print(idx, row)

        prob = (len(match_sym.intersection(set(final_symp)))+1)/(len(set(final_symp))+1)
        prob *= mean_scores
        topk_dict[diseases[t]] = prob
        print(topk_dict)
    j = 0
    topk_index_mapping = {}
    topk_sorted = dict(sorted(topk_dict.items(), key=lambda kv: kv[1], reverse=True))  

    final_disease = [(key, topk_sorted[key]) for key in topk_sorted]
    return final_disease

def disease_info(disease):
    return diseaseDetail(disease)                                 


