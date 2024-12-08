import pandas as pd
import json
from pathlib import Path
import logging
from typing import Dict, Any, List, Tuple
from datetime import datetime

class FraudAnalysisProcessor:
    
    AMOUNT_BINS = [0, 1000, 5000, 10000, 20000, 50000, 100000, 200000, float('inf')]
    AMOUNT_LABELS = ['low', 'medium', 'medium_high', 'high', 'very_high', 'extremely_high', 'super_high', 'mega_high']
    
    def __init__(self, data_path: str, output_dir: str = "insights"):

        self.data_path = data_path
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)
        
        self.logger.info("Loading dataset...")
        self.df = pd.read_csv(data_path)
        self.logger.info(f"Loaded dataset with {len(self.df)} records")

    def save_json(self, data: Dict[str, Any], filename: str) -> None:
        output_path = self.output_dir / filename
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=4)
        self.logger.info(f"Saved insights to {output_path}")

    def get_amount_range_str(self, category_index: int) -> str:
        lower = f"${self.AMOUNT_BINS[category_index]:,.0f}"
        upper = "∞" if category_index == len(self.AMOUNT_BINS) - 2 else f"${self.AMOUNT_BINS[category_index + 1]:,.0f}"
        return f"{lower} - {upper}"

    def process_fraud_by_amount_category(self) -> None:
        self.df['amount_category'] = pd.cut(
            self.df['amount'],
            bins=self.AMOUNT_BINS,
            labels=self.AMOUNT_LABELS,
            right=False
        )
        
        categories_analysis = {}
        
        for idx, category in enumerate(self.AMOUNT_LABELS):
            category_data = self.df[self.df['amount_category'] == category]
            fraud_data = category_data[category_data['isFraud'] == 1]
            
            categories_analysis[category] = {
                "range": self.get_amount_range_str(idx),
                "total_transactions": int(len(category_data)),
                "fraud_transactions": int(len(fraud_data)),
                "fraud_percentage": round((len(fraud_data) / len(category_data) * 100), 2) if len(category_data) > 0 else 0,
                "total_amount": float(category_data['amount'].sum()),
                "fraud_amount": float(fraud_data['amount'].sum()),
                "average_fraud_amount": float(fraud_data['amount'].mean()) if len(fraud_data) > 0 else 0,
                "amount_range": {
                    "min": float(category_data['amount'].min()) if len(category_data) > 0 else self.AMOUNT_BINS[idx],
                    "max": float(category_data['amount'].max()) if len(category_data) > 0 else self.AMOUNT_BINS[idx + 1]
                }
            }
        
        fraud_distribution = self.df[self.df['isFraud'] == 1]['amount_category'].value_counts().to_dict()
        fraud_distribution = {k: int(v) for k, v in fraud_distribution.items()}
        
        result = {
            "categories": categories_analysis,
            "fraud_distribution": fraud_distribution,
            "metadata": {
                "total_transactions": int(len(self.df)),
                "total_fraud_transactions": int(self.df['isFraud'].sum()),
                "overall_fraud_percentage": round((self.df['isFraud'].sum() / len(self.df) * 100), 2),
                "total_amount": float(self.df['amount'].sum()),
                "total_fraud_amount": float(self.df[self.df['isFraud'] == 1]['amount'].sum())
            }
        }
        
        self.save_json(result, "fraud_by_amount_category.json")

    def process_all_insights(self) -> None:
        self.logger.info("Starting to process all insights...")
        self.process_fraud_by_amount_category()
        self.logger.info("Completed processing all insights")

def main():
    processor = FraudAnalysisProcessor('Synthetic_Financial_datasets_log.csv')
    
    processor.process_all_insights()

if __name__ == "__main__":
    main()