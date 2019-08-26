import os
import tempfile
import pytest
from spatialskillsproject.app import app


#https://flask.palletsprojects.com/en/1.0.x/testing/
@pytest.fixture
def client():
    db_fd, flaskr.app.config['DATABASE'] = tempfile.mkstemp()
    flaskr.app.config['TESTING'] = True
    client = app.app.test_client()

    with app.app.app_context():
        app.init_db()

    yield client

    os.close(db_fd)
    os.unlink(app.app.config['DATABASE'])

