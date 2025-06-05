from flask import Blueprint, jsonify
from .mindmap import mindmap

api_routes = Blueprint("api_routes", __name__)
api_routes.register_blueprint(mindmap)

@api_routes.route("/api/ping")
def ping():
    return jsonify({"message": "pong"})
