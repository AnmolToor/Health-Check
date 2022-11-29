from fastapi import FastAPI
from pydantic import BaseModel
from script import disease_info, synonymous_symptoms, other_occuring_symptoms, predict_probability

app = FastAPI()

class Sym(BaseModel):
    symptom_list: list

class Disease(BaseModel):
    disease_input : str
    

@app.get("/")
async def root():
    return {
        "check synonym symptoms at": "/synonymous-symptoms",
        "co-occuring symptoms at" : "/coocurring-symptoms",
        "predict disease at" : "/predict-disease",
        "disease info at" : "/disease-detail/disease"
    }

@app.post("/synonymous-symptoms")
async def synonym(disease: Disease):
    return synonymous_symptoms(disease.disease_input)

@app.post("/coocurring-symptoms")
async def similar_symptoms(sym: Sym):
    return other_occuring_symptoms(sym.symptom_list)

@app.post("/predict-disease")
async def predict_disease(final_symp: list):
    return predict_probability(final_symp)

@app.get("/disease-detail/{disease}")
async def diseaseinfo(disease):
    return disease_info(disease)