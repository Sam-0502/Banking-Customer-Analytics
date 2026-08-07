from flask import Blueprint, jsonify
from sqlalchemy import func, extract
from backend.models import Experiment
from backend import db

dashboard_bp = Blueprint('dashboard', __name__)

MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


def _loan_status_distribution(total, approved, rejected):
    pending = max(total - approved - rejected, 0)
    return [
        {'name': 'Approved', 'value': approved},
        {'name': 'Rejected', 'value': rejected},
        {'name': 'Pending', 'value': pending},
    ]


def _monthly_loans():
    monthly = {i: 0 for i in range(1, 13)}
    results = db.session.query(
        extract('month', Experiment.timestamp).label('month'),
        func.count(Experiment.experiment_id).label('count')
    ).group_by('month').order_by('month').all()
    for row in results:
        if row.month is not None:
            monthly[int(row.month)] = row.count
    return [{'month': MONTH_LABELS[i - 1], 'loans': monthly[i]} for i in range(1, 13)]


def get_dashboard_chart_data():
    return [
        {'name': '18-25', 'customers': 480},
        {'name': '26-35', 'customers': 820},
        {'name': '36-45', 'customers': 710},
        {'name': '46-55', 'customers': 360},
        {'name': '56+', 'customers': 220},
    ]


def get_credit_score_distribution():
    return [
        {'range': '300-579', 'value': 120},
        {'range': '580-669', 'value': 310},
        {'range': '670-739', 'value': 540},
        {'range': '740-799', 'value': 360},
        {'range': '800+', 'value': 170},
    ]


def get_customer_segmentation():
    return [
        {'name': 'Premium', 'value': 28},
        {'name': 'Gold', 'value': 22},
        {'name': 'Silver', 'value': 30},
        {'name': 'Bronze', 'value': 20},
    ]


@dashboard_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    total = db.session.query(func.count(Experiment.experiment_id)).scalar() or 0
    approved = db.session.query(func.count()).filter(Experiment.experiment_status == 'Success').scalar() or 0
    rejected = db.session.query(func.count()).filter(Experiment.experiment_status == 'Failed').scalar() or 0
    avg_cost = db.session.query(func.avg(Experiment.research_cost_usd)).scalar() or 0

    default_rate = round((rejected / total) * 100, 2) if total else 0.0
    active_customers = approved
    average_loan_amount = round(avg_cost or 0, 2)

    return jsonify({
        'total_customers': total,
        'active_customers': active_customers,
        'approved_loans': approved,
        'rejected_loans': rejected,
        'average_loan_amount': average_loan_amount,
        'default_rate': default_rate,
        'loan_status_distribution': _loan_status_distribution(total, approved, rejected),
        'monthly_loans': _monthly_loans(),
        'age_distribution': get_dashboard_chart_data(),
        'credit_score_distribution': get_credit_score_distribution(),
        'customer_segmentation': get_customer_segmentation(),
        'insight': 'Customer retention is strong, with approvals trending upward in recent months.'
    })
