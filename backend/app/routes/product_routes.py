from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_products():
    return {"message": "Products endpoint - coming soon"}

@router.get("/{product_id}")
async def get_product(product_id: str):
    return {"message": f"Product {product_id} details - coming soon"}