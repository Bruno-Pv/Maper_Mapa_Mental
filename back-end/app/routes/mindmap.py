from flask import Blueprint, jsonify
import json
import os

mindmap = Blueprint('mindmap', __name__)
data_path = os.path.join(os.path.dirname(__file__), '..', 'data')

@mindmap.route('/api/mindmap/<language>')
def get_language(language):
    try:
        with open(f"{data_path}/{language.lower()}.json", encoding="utf-8") as file:
            content = json.load(file)
        return jsonify(content)
    except FileNotFoundError:
        return jsonify({"error": "Language not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON format"}), 400