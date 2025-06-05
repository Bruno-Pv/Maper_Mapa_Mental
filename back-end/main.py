from flask import Flask
from app.routes import api_routes
from flask_cors import CORS

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)


app.register_blueprint(api_routes)


if __name__ == "__main__":
    app.run(debug=True)