from fastapi import FastAPI
from pydantic import BaseModel
from script import disease_info, synonymous_symptoms, other_occuring_symptoms, predict_probability
from typing import Union
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

app = FastAPI()

class Sym(BaseModel):
    symptom_list: list

class Disease(BaseModel):
    disease_input : str
    

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/synonymous-symptoms")
async def synonym(disease: Disease):
    return synonymous_symptoms(disease.disease_input)

@app.post("/coocurring-symptoms")
async def similar_symptoms(sym: Sym):
    return other_occuring_symptoms(sym.symptom_list)

@app.post("/predict-disease")
async def predict_disease(final_symp: list):
    json_compatible_item_data = jsonable_encoder(predict_probability(final_symp))
    return JSONResponse(content=json_compatible_item_data)
    # return predict_probability(final_symp)

@app.get("/disease-detail/{disease}")
async def diseaseinfo(disease):
    return disease_info(disease)