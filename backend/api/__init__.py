from flask import Blueprint

api_blueprint = Blueprint('api', __name__)

from .dashboard import dashboard_bp
from .experiments import experiments_bp
from .predictions import predictions_bp

api_blueprint.register_blueprint(dashboard_bp)
api_blueprint.register_blueprint(experiments_bp)
api_blueprint.register_blueprint(predictions_bp)
