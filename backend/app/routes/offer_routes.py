from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_offers():
    return {"message": "Offers endpoint - coming soon"}