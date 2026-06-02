import pytest
from sqlmodel import Session, SQLModel, create_engine, select
from app.models import Crop, Variety

@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine("sqlite://")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

def test_create_crop_and_variety(session: Session):
    # Create a Crop
    tomato = Crop(name="Tomato", description="Red fruit crop")
    session.add(tomato)
    session.commit()
    session.refresh(tomato)
    
    assert tomato.id is not None
    assert tomato.name == "Tomato"
    
    # Create a Variety
    roma = Variety(
        name="Roma", 
        crop_id=tomato.id, 
        origin="Italy", 
        season="Summer", 
        fruit_size="Medium"
    )
    session.add(roma)
    session.commit()
    session.refresh(roma)
    
    assert roma.id is not None
    assert roma.crop_id == tomato.id
    assert roma.name == "Roma"
    
    # Test relationship
    assert len(tomato.varieties) == 1
    assert tomato.varieties[0].name == "Roma"
    assert roma.crop.name == "Tomato"

def test_query_crops(session: Session):
    session.add(Crop(name="Tomato", description="Red"))
    session.add(Crop(name="Pepper", description="Green/Red"))
    session.commit()
    
    crops = session.exec(select(Crop)).all()
    assert len(crops) == 2
    assert any(c.name == "Tomato" for c in crops)
    assert any(c.name == "Pepper" for c in crops)
