from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from script import disease_info, synonymous_symptoms, other_occuring_symptoms, predict_probability

app = FastAPI()

class Sym(BaseModel):
    symptom_list: list

class Disease(BaseModel):
    disease_input : str

class Diseasepredict(BaseModel):
    final_symp : list
    
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:3000",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



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
async def predict_disease(diseasepredict: Diseasepredict):
    return predict_probability(diseasepredict.final_symp)

@app.get("/disease-detail/{disease}")
async def diseaseinfo(disease):
    return disease_info(disease)