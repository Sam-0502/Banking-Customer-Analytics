from flask import Blueprint, jsonify, request
from backend.models import Experiment
from backend import db
from sqlalchemy import desc

experiments_bp = Blueprint('experiments', __name__)

@experiments_bp.route('/experiments', methods=['GET'])
def list_experiments():
    """Return a paginated list of experiments.
    Query parameters:
        page (int): page number (default 1)
        per_page (int): items per page (default 20)
        sort (str): column to sort by (default 'timestamp')
        order (str): 'asc' or 'desc' (default 'desc')
    """
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    sort = request.args.get('sort', 'timestamp')
    order = request.args.get('order', 'desc')

    query = Experiment.query
    sort_col = getattr(Experiment, sort, Experiment.timestamp)
    if order == 'desc':
        query = query.order_by(desc(sort_col))
    else:
        query = query.order_by(sort_col)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    items = []
    for exp in pagination.items:
        items.append({
            'experiment_id': exp.experiment_id,
            'timestamp': exp.timestamp.isoformat(),
            'facility_id': exp.facility_id,
            'equipment_id': exp.equipment_id,
            'environment_type': exp.environment_type,
            'altitude_km': exp.altitude_km,
            'ambient_temp_k': exp.ambient_temp_k,
            'measured_gravity_ms2': exp.measured_gravity_ms2,
            'experiment_status': exp.experiment_status,
            'failure_reason': exp.failure_reason,
            'experiment_status_binary': exp.experiment_status_binary,
        })
    return jsonify({
        'page': page,
        'per_page': per_page,
        'total': pagination.total,
        'pages': pagination.pages,
        'items': items
    })
