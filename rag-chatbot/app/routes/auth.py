from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import AuthService
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account"
)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Registers a new user with an email and password.
    Hashes password using bcrypt before persisting to PostgreSQL.
    """
    return AuthService.register_user(db=db, user_in=user_in)


@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user and obtain JWT access token"
)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Validates user email & password and returns a JWT access token.
    """
    return AuthService.authenticate_user(db=db, login_data=login_data)


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current authenticated user profile"
)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Protected route. Returns profile information for the authenticated user.
    """
    return current_user
