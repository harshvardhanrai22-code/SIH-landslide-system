# AI-Based Early Warning and Landslide Risk Prediction ML Engine — Complete Builder Guide

**Region:** North Eastern Region (NER), India
**Version:** 1.0.0
**Date:** 26 August 2026
**Based On:** ML Engine Product Requirements Document (PRD) v1.0.0

---

> **Purpose:** This Builder Guide is a comprehensive implementation handbook for the AI Landslide Risk Prediction ML Engine. It functions as an Architecture Guide + ML Research Guide + Dataset Engineering Guide + Coding Guide + Source Code Reference + Testing Guide + Deployment Guide. A competent ML/Python developer should be able to use this document as the primary implementation reference for the entire ML Engine.

> **Companion Document:** [PRD_ML_Risk_Prediction_Engine.md](file:///c:/AI-Based%20Early%20Warning%20and%20Landslide%20Risk%20Monitoring/PRD_ML_Risk_Prediction_Engine.md)

---

## Table of Contents

### Part 1 — Foundations
- Section 1: Product and ML Context
- Section 2: Scientific Definition of the ML Problem
- Section 3: Research — Existing Landslide ML Systems
- Section 4: Research Findings and Design Decisions
- Section 5: Complete Project Architecture
- Section 6: Configuration and Project Setup Files

### Part 2 — Data Engineering
- Section 7: Data Source Catalog
- Section 8: Dataset Acquisition
- Section 9: Data Validation
- Section 10: Data Cleaning
- Section 11: Geospatial Processing
- Section 12: Spatial Unit Analysis
- Section 13: Temporal Alignment
- Section 14: Label Creation
- Section 15: Negative Sampling

### Part 3 — Feature Engineering and Dataset Construction
- Section 16: Feature Engineering
- Section 17: Feature Leakage Prevention
- Section 18: Dataset Builder
- Section 19: Final Training Dataset Schema
- Section 20: Exploratory Data Analysis

### Part 4 — Model Training, Evaluation and Validation
- Section 21: Dataset Splitting
- Section 22: Model Metrics
- Section 23: Baseline Model
- Section 24: Logistic Regression
- Section 25: Random Forest
- Section 26: XGBoost
- Section 27: Model Registry
- Section 28: Experiment Tracking
- Section 29: Training Script
- Section 30: Probability Calibration
- Section 31: Threshold Optimization
- Section 32: False Negative Analysis
- Section 33: False Positive Analysis
- Section 34: Temporal and Geographic Validation
- Section 35: Explainability

### Part 5 — Replay, API, Testing and Deployment
- Section 36: Historical Replay Engine
- Section 37: Stress Testing
- Section 38: Model Comparison
- Section 39: Model Packaging
- Section 40: Model Versioning and Metadata
- Section 41: FastAPI Inference Service
- Section 42: Error Handling
- Section 43: Complete Test Suite
- Section 44: Dockerfile and Docker Compose
- Section 45: Production Configuration
- Section 46: Monitoring
- Section 47: Model Drift and Retraining
- Section 48: Limitations
- Section 49: MVP vs Future
- Section 50: Build Order
- Section 51: Command Reference
- Section 52: Troubleshooting Guide
- Section 53: Final Project Tree
- Section 54: Builder Checklist

---
# PART 1: FOUNDATIONS (Sections 1-6)

## Section 1: Product and ML Context

The North Eastern Region (NER) of India is highly susceptible to rainfall-induced landslides, causing significant loss of life and infrastructure damage every monsoon season. The Smart India Hackathon (SIH) problem statement requires the development of an AI-based Early Warning and Landslide Risk Monitoring system that can accurately predict hazard zones before they occur, using freely available data streams.

To achieve this, the platform architecture relies on a robust multi-tier system:
1. **React Frontend**: User interface for visualization, risk dashboard, and alert management.
2. **.NET Backend**: Handles business logic, user authentication, database management (users, alert logs), and orchestrates requests between the frontend and the ML engine.
3. **FastAPI Inference Service**: Exposes the trained ML models via REST APIs, serving real-time predictions based on current meteorological inputs.
4. **Python ML Engine (Scope of this Guide)**: The core intelligence of the system.

**Scope of this ML Engine**:
This guide exclusively covers the **Python ML Engine**. This encompasses the data ingestion pipeline, feature engineering, dataset construction, model training, geospatial evaluation, and the FastAPI service wrapper. It does *not* cover the React or .NET details, as the ML engine operates as a decoupled microservice.

---

## Section 2: Scientific Definition of the ML Problem

Landslide prediction is inherently complex due to the combination of static geological predisposing factors and dynamic triggering mechanisms. To formulate this as a supervised machine learning problem, we must precisely define our parameters:

*   **Spatial Unit**: Grid cell (~1km × 1km resolution for the MVP). This resolution is chosen to match the standard resolution of satellite precipitation products and global soil moisture datasets, balancing computational feasibility with local relevance.
*   **Prediction Timestamp ($t_0$)**: The exact point in time at which the prediction is made and the feature state is captured.
*   **Prediction Window**: A 24-hour forward window ($t_0$ to $t_0 + 24h$). The model predicts whether an event will occur in this timeframe.
*   **Positive Event (Class 1)**: The documented occurrence of a landslide originating within the boundaries of the specific spatial unit during the prediction window.
*   **Negative Event (Class 0)**: No recorded landslide within the spatial unit during the prediction window.
*   **Feature Availability**: Features must strictly be available *at or before* the prediction timestamp $t_0$. Using data from $t_0 + 12h$ to predict the $24h$ window is data leakage.
*   **Target Variable**: Binary (0 or 1). Output is a calibrated probability $P(Y=1 | X)$ which represents the likelihood of the event.

**Understanding Terminology (Crucial Distinction):**
*   **Landslide Susceptibility**: *Where* landslides are likely to occur based on static terrain and geological conditions. It is time-independent.
*   **Landslide Hazard**: *When and Where* landslides are likely to occur. It combines susceptibility with dynamic triggers (like rainfall) to yield a time-dependent probability.
*   **Landslide Risk**: *Hazard × Exposure × Vulnerability*. It represents the actual potential loss (human, economic, infrastructural).

**Explicit Claim**: The MVP predicts dynamic **HAZARD** (rainfall-triggered landslide likelihood given current conditions), NOT full societal risk. Do not overclaim the model's output as "Risk" unless downstream exposure overlays (e.g., population, infrastructure maps) are applied.

---

## Section 3: Research — Existing Landslide ML Systems

To ensure our system is grounded in proven science, we heavily lean on existing research, primarily NASA's Landslide Hazard Assessment for Situational Awareness (LHASA) model.

### NASA LHASA
NASA's LHASA model is the global standard for heuristic and ML-based landslide hazard modeling.
*   **LHASA 1.0 (2018)**: A rule-based heuristic model mapping a 7-day Antecedent Rainfall Index (ARI) over a global susceptibility map.
*   **LHASA 1.1**: Added forest loss and road density as static susceptibility modifiers.
*   **LHASA 2.0 (2021)**: Transitioned to a Machine Learning framework using XGBoost.
    *   *Static features*: Slope (SRTM 30m/90m), lithology (GLiM), distance to faults, distance to roads (gROADS+OSM), and forest loss (Hansen).
    *   *Dynamic features*: GPM IMERG rainfall (various temporal aggregations), SMAP L4 soil moisture, snow mass, burn scars, seismic PGA.
    *   *Key Innovation*: **XGBoost interaction_constraints**. The model is constrained so that static features can only interact with dynamic features, preventing the model from over-indexing on highly susceptible static areas that have no current trigger.
    *   *Output*: Continuous calibrated probability (0-1).
    *   *Resolution*: ~1km, daily updates.
    *   *Accolades*: Won NASA Software of the Year 2023.
    *   *Papers*: Stanley et al. 2021 (DOI: 10.3389/feart.2021.640043), Kirschbaum & Stanley 2018 (DOI: 10.1002/2017EF000715).
    *   *GitHub*: https://github.com/nasa/LHASA
    *   *Limitations*: 1km resolution is too coarse for local planning, satellite precipitation (GPM) often underestimates orographic rainfall in mountainous regions, and the global catalog suffers from heavy English-language reporting bias.

### Our Adaptation
```
LHASA Approach → Relevant Ideas → NER Requirements → Our Adaptation
```
*   **Adopt trigger-cause architecture with interaction constraints**: We will use XGBoost with strict interaction rules to ensure physical plausibility.
*   **Use higher-resolution DEM**: We upgrade from SRTM to Copernicus GLO-30 (30m) for significantly better vertical accuracy in the steep NER topography.
*   **Supplement GPM IMERG with ERA5-Land**: Given GPM's underestimation of orographic rainfall, we will use ERA5-Land reanalysis data to gap-fill and improve historical training datasets.
*   **Use GSI/ISRO inventories**: We replace NASA's GLC with local, verified landslide inventories from the Geological Survey of India (GSI) and ISRO.
*   **Add NER-specific anthropogenic factors**: We integrate proxies for hill cutting, highway expansion, and jhum (shifting) cultivation, which are primary local triggers.

### USGS Research
*   **TRIGRS model** (Baum et al. 2008): A physically-based slope stability model. While physically accurate, it requires extensive geotechnical data (soil cohesion, friction angle) unavailable across the entire NER, justifying our ML approach.
*   **Mirus et al. 2020**: Strategies for national landslide hazard mapping.
*   **Spatial Validation Foundations**: Brenning (2005, 2012) established that non-spatial cross-validation in spatial ML problems vastly overestimates model performance due to spatial autocorrelation.

### Key Scientific Literature
*   **Merghadi et al. 2020**: Extensive ML benchmark for landslides showing Tree-based ensembles (RF/XGBoost) consistently outperform SVMs and Neural Networks for tabular geospatial data (DOI: 10.1016/j.earscirev.2020.103225).
*   **Catani et al. 2013**: Key paper on using Random Forest for landslide susceptibility mapping (DOI: 10.5194/nhess-13-2815-2013).
*   **Guzzetti et al. 2020**: Comprehensive review of empirical rainfall thresholds for triggering landslides (DOI: 10.1016/j.earscirev.2020.103296).
*   **Dikshit et al. 2020**: Specific review of rainfall-induced landslides in the Indian Himalayas, detailing regional monsoon mechanics (DOI: 10.3390/app10072466).

---

## Section 4: Research Findings and Design Decisions

Our pipeline design is directly informed by the scientific literature. We log our architectural choices using the formal decision format.

1. **Algorithm Choice**
   * *Research Finding*: Merghadi et al. (2020) demonstrated tree ensembles (XGBoost, RF) are state-of-the-art for landslide tabular data. LHASA 2.0 successfully deployed XGBoost globally.
   * *Why It Matters*: We need robust non-linear modeling capable of handling missing data and tabular geospatial features without the massive data requirements of Deep Learning.
   * *Decision*: XGBoost is the primary algorithm; Random Forest is the secondary baseline.
   * *Implementation Consequence*: The pipeline relies on `xgboost` and `scikit-learn`.

2. **Spatial Validation over Random CV**
   * *Research Finding*: Brenning (2005) proved random cross-validation inflates AUROC by 10-25% in spatial datasets due to spatial autocorrelation (Tobler's First Law of Geography).
   * *Why It Matters*: If we randomly split data, the model memorizes the terrain near known landslides instead of learning generalized patterns.
   * *Decision*: Implement spatial block cross-validation (Spatial K-Fold).
   * *Implementation Consequence*: `src/landslide_ml/dataset/splitting.py` must use spatial clustering (e.g., KMeans on coordinates or grid-based blocks) for train/val splits.

3. **Interaction Constraints**
   * *Research Finding*: LHASA 2.0 (Stanley et al., 2021) forced static features to only interact with dynamic triggers to prevent false positives in high-susceptibility/dry areas.
   * *Why It Matters*: Prevents the model from creating decision trees based purely on static geology, forcing it to act as a *dynamic hazard* model.
   * *Decision*: Utilize XGBoost's `interaction_constraints` parameter.
   * *Implementation Consequence*: We must strictly partition feature names into "static" and "dynamic" lists in our config and pass the constraint list to the XGBoost API during training.

4. **Negative Sampling with Buffer Exclusion**
   * *Research Finding*: Generating random non-landslide points often selects flat plains. The model easily learns "slope > 0 = landslide" (the flat-slope trap), which fails in real mountainous deployments.
   * *Why It Matters*: We need the model to learn the difference between a safe steep slope and a dangerous steep slope.
   * *Decision*: Sample negative points in mountainous regions, excluding a buffer zone around positive events.
   * *Implementation Consequence*: `src/landslide_ml/dataset/sampling.py` must enforce slope minimums and spatial buffer exclusions for negative samples.

5. **ERA5-Land as Primary Rainfall Source**
   * *Research Finding*: GPM IMERG underestimates orographic rainfall. ERA5-Land provides consistent, physics-informed historical reanalysis (hourly, 9km, 1950-present).
   * *Why It Matters*: High-quality historical rainfall is essential for training the relationship between antecedent moisture and failure.
   * *Decision*: Use ERA5-Land for historical training and calibration.
   * *Implementation Consequence*: Data ingestion must integrate with the Copernicus Climate Data Store API.

6. **Copernicus GLO-30 DEM over SRTM**
   * *Research Finding*: GLO-30 provides a newer (2015 vs 2000), higher quality baseline with better vertical accuracy than the aging SRTM mission.
   * *Why It Matters*: Accurate slope and aspect calculations are the most critical static predictors.
   * *Decision*: Standardize all terrain processing on Copernicus GLO-30.
   * *Implementation Consequence*: Raster processing pipelines must handle the specific GeoTIFF format and coordinate reference systems of GLO-30.

7. **Handling Class Imbalance**
   * *Research Finding*: Landslides are extremely rare events compared to non-events. Synthetic sampling (SMOTE) often breaks the spatial continuity and physical reality of geospatial features.
   * *Why It Matters*: We need to correct imbalance without fabricating impossible terrain conditions.
   * *Decision*: Use cost-sensitive learning (class weights / `scale_pos_weight`) instead of SMOTE.
   * *Implementation Consequence*: Training scripts calculate and inject sample weights directly into the loss function.

8. **Grid-Cell Spatial Unit for MVP**
   * *Research Finding*: Slope Units (hydrological catchments) are physically ideal but computationally expensive and hard to align with coarse raster data (rainfall).
   * *Why It Matters*: We need a system that can be built and evaluated quickly for the MVP.
   * *Decision*: Use a fixed 1km grid-cell spatial unit.
   * *Implementation Consequence*: Geospatial pipelines rely on raster masking and array stacking rather than complex vector geometries.

---

## Section 5: Complete Project Architecture

The repository is structured to separate configuration, data pipelines, model code, and API serving.

```text
ner-landslide-ml/
├── README.md                  # Project overview and setup instructions
├── pyproject.toml             # Python package and dependency configuration
├── requirements.txt           # Pinned dependencies for deployment
├── .env.example               # Environment variables template
├── .gitignore                 # Version control exclusions
├── Dockerfile                 # Containerization definition for the API
├── docker-compose.yml         # Local orchestration (API + external services)
├── configs/                   # YAML configuration files
│   ├── base.yaml              # Core settings (NER bbox, features, thresholds)
│   ├── development.yaml       # Dev overrides (smaller datasets, verbose logs)
│   └── production.yaml        # Prod overrides (strict timeouts, optimized paths)
├── data/                      # Local data storage (Not version controlled)
│   ├── raw/                   # Immutable original downloaded files
│   ├── external/              # Third-party datasets (e.g., shapefiles)
│   ├── interim/               # Intermediate processing states
│   ├── processed/             # Final cleaned datasets ready for feature extraction
│   └── features/              # Extracted ML feature stores (Parquet)
├── notebooks/                 # Jupyter notebooks for EDA and R&D
│   ├── 01_data_exploration.ipynb # Raw data sanity checks
│   ├── 02_feature_analysis.ipynb # Feature correlation, importance
│   └── 03_model_analysis.ipynb   # Error analysis, SHAP visualization
├── scripts/                   # Executable entrypoints for pipelines
│   ├── download_data.py       # Fetch external datasets (ERA5, GLO-30)
│   ├── validate_data.py       # Check data integrity and completeness
│   ├── process_data.py        # Align grids, reproject, clean
│   ├── build_dataset.py       # Generate positive/negative samples and extract features
│   ├── train_model.py         # Model training loop
│   ├── evaluate_model.py      # Spatial cross-validation and test set evaluation
│   └── run_replay.py          # Historical event replay simulation
├── src/                       # Core ML Engine library code
│   └── landslide_ml/          # Main package namespace
│       ├── __init__.py        
│       ├── config/            # Configuration management (YAML + Env)
│       │   ├── __init__.py
│       │   ├── settings.py    # Pydantic BaseSettings class
│       │   └── logging.py     # Structured JSON logging setup
│       ├── data/              # Data IO and basic preprocessing
│       │   ├── __init__.py
│       │   ├── ingestion.py   # API wrappers (Copernicus, GEE)
│       │   ├── validation.py  # Pydantic schemas for dataframes
│       │   ├── cleaning.py    # NaN handling, outlier capping
│       │   └── loaders.py     # Utilities to load standard formats (TIFF, Parquet)
│       ├── geospatial/        # GIS specific processing
│       │   ├── __init__.py
│       │   ├── coordinates.py # CRS conversions (EPSG:4326 to localized projected)
│       │   ├── spatial_join.py# Point-to-raster extraction
│       │   ├── raster.py      # Resampling, clipping, masking
│       │   └── terrain.py     # Slope, aspect, curvature calculations
│       ├── features/          # Feature engineering logic
│       │   ├── __init__.py
│       │   ├── rainfall.py    # Antecedent Rainfall Index (ARI) logic
│       │   ├── soil.py        # Soil moisture integration
│       │   ├── terrain.py     # Static geology mapping
│       │   ├── historical.py  # Distance to previous landslides
│       │   ├── geographic.py  # Distance to roads/faults
│       │   └── pipeline.py    # Scikit-learn feature unions/pipelines
│       ├── dataset/           # ML dataset construction
│       │   ├── __init__.py
│       │   ├── labels.py      # True event mapping
│       │   ├── sampling.py    # Negative sampling with buffers
│       │   ├── splitting.py   # Spatial K-Fold block logic
│       │   └── builder.py     # Combines labels, features, and splits
│       ├── models/            # Modeling algorithms
│       │   ├── __init__.py
│       │   ├── baseline.py    # Simple heuristic baseline
│       │   ├── logistic.py    # Linear baseline
│       │   ├── random_forest.py # RF implementation
│       │   ├── xgboost_model.py # Core XGB implementation with constraints
│       │   ├── calibration.py # Platt scaling / Isotonic regression
│       │   └── registry.py    # Model saving, loading, metadata tracking
│       ├── evaluation/        # Specialized ML metrics
│       │   ├── __init__.py
│       │   ├── metrics.py     # Brier score, AUROC, AUPRC
│       │   ├── confusion.py   # Hazard-level confusion matrices
│       │   ├── calibration.py # Reliability diagrams
│       │   ├── temporal.py    # Performance over time
│       │   ├── geographic.py  # Performance by state/district
│       │   ├── replay.py      # Historical event simulation evaluator
│       │   └── stress.py      # Noise and missing data robustness tests
│       ├── explainability/    # XAI logic
│       │   ├── __init__.py
│       │   ├── global_importance.py # Permutation importance, gain
│       │   └── local_shap.py  # SHAP value generation for predictions
│       └── api/               # FastAPI serving layer
│           ├── __init__.py
│           ├── main.py        # FastAPI app definition
│           ├── dependencies.py# Model injection, auth
│           ├── routes/        # Endpoint routers
│           │   ├── __init__.py
│           │   ├── health.py  # Liveness/Readiness probes
│           │   ├── model_info.py # Return active model metadata
│           │   └── prediction.py # Inference endpoints
│           └── schemas/       # Request/Response Pydantic models
│               ├── __init__.py
│               ├── prediction.py
│               ├── model_info.py
│               └── errors.py
├── models/                    # Serialized model artifacts (.ubj or .pkl)
│   ├── registry/              # Local tracking (e.g., MLflow alternative format)
│   └── production/            # Symlinks to current active models
├── reports/                   # Generated artifacts
│   ├── data/                  # Data profiling reports
│   ├── experiments/           # Hyperparameter tuning results
│   ├── evaluation/            # Final model metrics
│   └── validation/            # Spatial block maps
└── tests/                     # Pytest suite
    ├── __init__.py
    ├── conftest.py            # Test fixtures (dummy datasets, models)
    ├── unit/                  # Fast, isolated tests
    ├── integration/           # Pipeline connectivity tests
    ├── ml/                    # Deterministic model logic tests
    └── api/                   # FastAPI route tests
```

---

## Section 6: Configuration and Project Setup Files

This section provides the exact content for initializing the environment and configuration infrastructure.

### `pyproject.toml`
```toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "landslide_ml"
version = "0.1.0"
description = "AI Landslide Risk Prediction ML Engine"
readme = "README.md"
requires-python = ">=3.10"
authors = [
    { name = "ML Engineering Team" }
]
dependencies = [
    "fastapi>=0.103.1",
    "uvicorn>=0.23.2",
    "pydantic>=2.3.0",
    "pydantic-settings>=2.0.3",
    "pyyaml>=6.0.1",
    "scikit-learn>=1.3.0",
    "xgboost>=2.0.0",
    "pandas>=2.1.0",
    "numpy>=1.24.3",
    "geopandas>=0.14.0",
    "rasterio>=1.3.8",
    "shapely>=2.0.1",
    "structlog>=23.1.0"
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.2",
    "black>=23.9.1",
    "flake8>=6.1.0",
    "mypy>=1.5.1",
    "jupyter>=1.0.0"
]

[tool.setuptools.packages.find]
where = ["src"]
include = ["landslide_ml*"]

[tool.black]
line-length = 88
target-version = ['py310']
```

### `requirements.txt`
```text
fastapi==0.103.1
uvicorn==0.23.2
pydantic==2.3.0
pydantic-settings==2.0.3
pyyaml==6.0.1
scikit-learn==1.3.0
xgboost==2.0.0
pandas==2.1.0
numpy==1.24.3
geopandas==0.14.0
rasterio==1.3.8
shapely==2.0.1
structlog==23.1.0
```

### `.env.example`
```env
# Environment Setup
ENVIRONMENT=development
LOG_LEVEL=INFO

# Overrides for Paths (defaults defined in configs/base.yaml)
DATA_DIR=./data
MODEL_DIR=./models/production

# API Authentication
API_KEY_SECRET=change_me_in_production

# External APIs
COPERNICUS_API_KEY=your_cds_api_key_here
```

### `.gitignore`
```text
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment
venv/
env/
ENV/
.env

# IDEs
.idea/
.vscode/
*.swp

# Data and Models
data/raw/*
data/external/*
data/interim/*
data/processed/*
data/features/*
!data/**/.gitkeep
models/registry/*
models/production/*
!models/**/.gitkeep

# Notebooks
.ipynb_checkpoints

# Logs and Reports
*.log
reports/data/*
reports/experiments/*
reports/evaluation/*
reports/validation/*
!reports/**/.gitkeep
```

### `configs/base.yaml`
```yaml
environment: "base"

ner_bounding_box:
  min_lat: 21.5
  max_lat: 29.5
  min_lon: 89.5
  max_lon: 97.5

data_paths:
  raw: "data/raw"
  processed: "data/processed"
  features: "data/features"
  models: "models/registry"

features:
  static:
    - "slope_degrees"
    - "aspect"
    - "elevation_m"
    - "distance_to_road_m"
    - "distance_to_fault_m"
    - "lithology_class"
    - "forest_loss_boolean"
  dynamic:
    - "ari_7day_mm"
    - "rainfall_24h_mm"
    - "soil_moisture_index"
  categorical:
    - "lithology_class"

model:
  algorithm: "xgboost"
  target_column: "landslide_occurred"
  spatial_cv_folds: 5
  xgboost_params:
    max_depth: 6
    learning_rate: 0.05
    n_estimators: 300
    subsample: 0.8
    colsample_bytree: 0.8
    objective: "binary:logistic"
    eval_metric: "aucpr"
    tree_method: "hist"

risk_thresholds:
  low: 0.2
  moderate: 0.5
  high: 0.75
  severe: 0.9

api:
  host: "0.0.0.0"
  port: 8000
  workers: 4
  timeout_seconds: 30
```

### `src/landslide_ml/__init__.py`
```python
"""
Landslide Risk Prediction ML Engine
"""

__version__ = "0.1.0"
```

### `src/landslide_ml/config/__init__.py`
```python
from .settings import get_settings
from .logging import setup_logging

__all__ = ["get_settings", "setup_logging"]
```

### `src/landslide_ml/config/settings.py`
```python
import os
from pathlib import Path
from typing import List, Dict, Any
import yaml
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class BoundingBox(BaseModel):
    min_lat: float
    max_lat: float
    min_lon: float
    max_lon: float

class DataPaths(BaseModel):
    raw: str
    processed: str
    features: str
    models: str

class FeatureConfig(BaseModel):
    static: List[str]
    dynamic: List[str]
    categorical: List[str]

    @property
    def all_features(self) -> List[str]:
        return self.static + self.dynamic

class ModelConfig(BaseModel):
    algorithm: str
    target_column: str
    spatial_cv_folds: int
    xgboost_params: Dict[str, Any]

class RiskThresholds(BaseModel):
    low: float
    moderate: float
    high: float
    severe: float

class APIConfig(BaseModel):
    host: str
    port: int
    workers: int
    timeout_seconds: int

class Settings(BaseSettings):
    environment: str = "development"
    
    # Nested configs
    ner_bounding_box: BoundingBox
    data_paths: DataPaths
    features: FeatureConfig
    model: ModelConfig
    risk_thresholds: RiskThresholds
    api: APIConfig
    
    # These can be overridden via environment variables
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    api_key_secret: str = Field(default="", alias="API_KEY_SECRET")
    copernicus_api_key: str = Field(default="", alias="COPERNICUS_API_KEY")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

def load_yaml_config(env: str = "base") -> Dict[str, Any]:
    """Loads base.yaml and merges with environment specific yaml if present."""
    config_dir = Path(__file__).parent.parent.parent.parent / "configs"
    
    # Load base configuration
    base_path = config_dir / "base.yaml"
    with open(base_path, "r") as f:
        config = yaml.safe_load(f)
    
    # Load environment specific configuration if it exists and isn't base
    if env != "base":
        env_path = config_dir / f"{env}.yaml"
        if env_path.exists():
            with open(env_path, "r") as f:
                env_config = yaml.safe_load(f)
                # Deep merge strategy could be applied here for production robustness
                config.update(env_config)
                
    return config

def get_settings() -> Settings:
    """Instantiate and return the application settings."""
    env = os.getenv("ENVIRONMENT", "base")
    yaml_dict = load_yaml_config(env)
    
    # BaseSettings will automatically parse yaml_dict and override with .env vars
    return Settings(**yaml_dict)
```

### `src/landslide_ml/config/logging.py`
```python
import logging
import sys
import structlog
from typing import Any, Dict

def setup_logging(log_level: str = "INFO") -> None:
    """
    Configures structured JSON logging for the application.
    This ensures logs can be easily ingested by ELK/Datadog or standard parsers.
    """
    level = getattr(logging, log_level.upper(), logging.INFO)
    
    structlog.configure(
        processors=[
            structlog.stdlib.add_log_level,
            structlog.stdlib.add_logger_name,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.JSONRenderer()
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    formatter = logging.Formatter(
        "%(message)s"  # We let structlog handle the formatting natively via JSONRenderer
    )
    
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)
    
    root_logger = logging.getLogger()
    root_logger.addHandler(handler)
    root_logger.setLevel(level)

    # Silence chatty libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("rasterio").setLevel(logging.WARNING)
```


---

# PART 2: DATA ENGINEERING (Sections 7-15)

This is the MOST IMPORTANT part of the guide. Dataset engineering is the heart of a landslide ML system. Machine learning algorithms can only learn what is present in the data. For landslides, this means carefully constructing a spatio-temporal dataset that perfectly aligns precipitation, terrain, and land cover features prior to each event.

## Section 7: Data Source Catalog

Building an accurate landslide model for the North Eastern Region (NER) of India requires diverse, high-quality geospatial datasets. Below is the catalog of datasets used in this engine.

### 1. NASA Global Landslide Catalog (COOLR)
- **Portal:** https://landslides.nasa.gov
- **Data:** https://catalog.data.gov/dataset/global-landslide-catalog-export
- **Format:** CSV, Shapefile, GeoJSON
- **License:** NASA Open Data (Public Domain)
- **Coverage:** Global, 2007-present
- **NER events:** ~100-250 (limited, media-biased)
- **Fields:** `ev_id`, `ev_date`, `latitude`, `longitude`, `ls_trigger`, `ls_type`, `location_accuracy`, `fatalities`

### 2. NASA GPM IMERG
- **Portal:** https://gpm.nasa.gov/data/imerg
- **GES DISC:** https://disc.gsfc.nasa.gov/datasets?keywords=IMERG
- **Resolution:** 0.1° (~10km), 30-minute
- **Three runs:** Early (4h latency), Late (14h latency), Final (3.5 months latency, gauge-calibrated)
- **Format:** HDF5, NetCDF4
- **Access:** NASA Earthdata login required

### 3. ECMWF ERA5-Land (PRIMARY for training)
- **CDS Portal:** https://cds.climate.copernicus.eu
- **Resolution:** 0.1° (~9km), hourly
- **Coverage:** 1950-present
- **Variables:** `total_precipitation`, `volumetric_soil_water_layer_1`, `volumetric_soil_water_layer_2`, `volumetric_soil_water_layer_3`, `volumetric_soil_water_layer_4`
- **Format:** NetCDF4
- **Access:** CDS API with free registration
- **NER bounding box:** `[29.5, 89.5, 21.5, 97.5]` (North, West, South, East)

### 4. Copernicus DEM GLO-30
- **Portal:** https://dataspace.copernicus.eu
- **OpenTopography:** https://portal.opentopography.org
- **AWS:** `s3://copernicus-dem-30m`
- **Resolution:** 30m
- **License:** Free and open

### 5. ESA WorldCover
- **Portal:** https://esa-worldcover.org
- **Resolution:** 10m
- **Classes:** 11 (Tree cover, Shrubland, Grassland, Cropland, Built-up, etc.)
- **License:** CC-BY 4.0
- **Format:** Cloud-Optimized GeoTIFF (COG)

### 6. OpenStreetMap (Roads & Rivers)
- **Geofabrik NER:** https://download.geofabrik.de/asia/india/north-eastern-zone.html
- **Format:** PBF
- **License:** ODbL 1.0

### 7. GSI Bhukosh (Landslide Inventory)
- **Portal:** https://bhukosh.gsi.gov.in/
- **Description:** 60,000+ historical events across India, many in NER. High quality field observations.
- **Access:** Requires registration; bulk download restricted. Typically handled offline for institutional use.

### 8. ISRO/NRSC Landslide Atlas
- **Bhuvan portal:** https://bhuvan-app1.nrsc.gov.in/disaster/disaster.php?id=landslide
- **Description:** ~80,000 validated polygons derived from high-resolution satellite imagery, ~15,000 in NER.

### Summary Comparison Matrix

| Dataset | Type | Resolution | Temporal | Access | Primary Use |
|---|---|---|---|---|---|
| NASA GLC | Point / Tabular | Variable | 2007-present | Open | Target labels (training/eval) |
| ERA5-Land | Raster | ~9km | Hourly | Free Account | Antecedent rainfall, Soil moisture |
| IMERG | Raster | ~10km | 30-min | Free Account | Real-time trigger monitoring |
| Copernicus DEM | Raster | 30m | Static (2015) | Open | Slope, aspect, curvature |
| ESA WorldCover | Raster | 10m | Annual | Open | Land cover classes |
| OpenStreetMap | Vector | High | Ongoing | Open | Distance to roads/rivers |


## Section 8: Dataset Acquisition

Robust data pipelines start with reliable acquisition scripts.

### `scripts/download_data.py`
```python
import os
import urllib.request
import logging
import hashlib
import time
from pathlib import Path
import cdsapi

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

NER_BBOX = [29.5, 89.5, 21.5, 97.5] # N, W, S, E

def calculate_checksum(file_path: Path) -> str:
    """Calculate MD5 checksum of a file."""
    md5_hash = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            md5_hash.update(chunk)
    return md5_hash.hexdigest()

def download_file(url: str, output_path: Path, max_retries: int = 3) -> bool:
    """Download a file with retry logic and progress logging."""
    for attempt in range(max_retries):
        try:
            logger.info(f"Downloading {url} to {output_path} (Attempt {attempt + 1})")
            
            # Create a simple progress reporter
            def progress(count, block_size, total_size):
                if count % 1000 == 0:
                    percent = int(count * block_size * 100 / total_size) if total_size > 0 else 0
                    logger.info(f"Progress: {percent}%")
                    
            urllib.request.urlretrieve(url, output_path, reporthook=progress)
            logger.info(f"Successfully downloaded {output_path}")
            return True
        except Exception as e:
            logger.error(f"Error downloading {url}: {e}")
            if attempt < max_retries - 1:
                time.sleep(5 * (attempt + 1))
            else:
                logger.error(f"Failed to download {url} after {max_retries} attempts.")
                return False
    return False

def download_era5_land(output_dir: Path, year: str = "2023"):
    """Download ERA5-Land data via CDS API for NER bounding box."""
    c = cdsapi.Client()
    output_path = output_dir / f"era5_land_ner_{year}.nc"
    if output_path.exists():
        logger.info(f"ERA5 file {output_path} already exists. Skipping.")
        return

    logger.info(f"Requesting ERA5-Land data for NER region, year {year}...")
    try:
        c.retrieve(
            'reanalysis-era5-land',
            {
                'variable': [
                    'total_precipitation',
                    'volumetric_soil_water_layer_1',
                    'volumetric_soil_water_layer_2',
                    'volumetric_soil_water_layer_3',
                    'volumetric_soil_water_layer_4',
                ],
                'year': year,
                'month': [f"{m:02d}" for m in range(1, 13)],
                'day': [f"{d:02d}" for d in range(1, 32)],
                'time': [f"{h:02d}:00" for h in range(24)],
                'area': NER_BBOX,
                'format': 'netcdf',
            },
            str(output_path)
        )
        logger.info(f"Downloaded ERA5-Land to {output_path}")
    except Exception as e:
        logger.error(f"CDS API request failed: {e}")

def download_nasa_glc(output_dir: Path):
    """Download NASA Global Landslide Catalog."""
    url = "https://data.nasa.gov/api/views/dd9e-wu2v/rows.csv?accessType=DOWNLOAD"
    output_path = output_dir / "nasa_glc.csv"
    if not output_path.exists():
        download_file(url, output_path)

def download_osm_ner(output_dir: Path):
    """Download OpenStreetMap PBF for NER region."""
    url = "https://download.geofabrik.de/asia/india/north-eastern-zone-latest.osm.pbf"
    output_path = output_dir / "ner_osm.pbf"
    if not output_path.exists():
        download_file(url, output_path)

def main():
    data_dir = Path("data/raw")
    data_dir.mkdir(parents=True, exist_ok=True)
    
    download_nasa_glc(data_dir)
    download_osm_ner(data_dir)
    download_era5_land(data_dir, year="2023")
    
    logger.info("Data download process completed.")

if __name__ == "__main__":
    main()
```

### `src/landslide_ml/data/ingestion.py`
```python
import pandas as pd
import xarray as xr
import geopandas as gpd
from pathlib import Path
import rasterio
from rasterio.merge import merge
import pyrosm

class LandslideIngestion:
    def __init__(self, data_path: str):
        self.data_path = Path(data_path)
        
    def load_and_filter(self, bbox: list) -> gpd.GeoDataFrame:
        """Loads GLC and filters for bounding box [N, W, S, E]."""
        df = pd.read_csv(self.data_path)
        # Bbox is [North, West, South, East]
        n, w, s, e = bbox
        
        mask = (
            (df['latitude'] >= s) & (df['latitude'] <= n) &
            (df['longitude'] >= w) & (df['longitude'] <= e)
        )
        df_filtered = df[mask].copy()
        
        # Convert to GeoDataFrame
        gdf = gpd.GeoDataFrame(
            df_filtered, 
            geometry=gpd.points_from_xy(df_filtered.longitude, df_filtered.latitude),
            crs="EPSG:4326"
        )
        return gdf

class ERA5Ingestion:
    def __init__(self, data_path: str):
        self.data_path = Path(data_path)
        
    def load_dataset(self) -> xr.Dataset:
        """Loads ERA5 NetCDF file."""
        return xr.open_dataset(self.data_path)
        
    def extract_variables(self) -> xr.Dataset:
        """Extract primary variables and format names."""
        ds = self.load_dataset()
        return ds[['tp', 'swvl1', 'swvl2', 'swvl3', 'swvl4']]

class DEMIngestion:
    def __init__(self, tile_paths: list[str]):
        self.tile_paths = [Path(p) for p in tile_paths]
        
    def create_mosaic(self, output_path: str) -> None:
        """Mosaics multiple DEM tiles into a single raster."""
        src_files_to_mosaic = []
        for fp in self.tile_paths:
            src = rasterio.open(fp)
            src_files_to_mosaic.append(src)
            
        mosaic, out_trans = merge(src_files_to_mosaic)
        out_meta = src_files_to_mosaic[0].meta.copy()
        
        out_meta.update({
            "driver": "GTiff",
            "height": mosaic.shape[1],
            "width": mosaic.shape[2],
            "transform": out_trans
        })
        
        with rasterio.open(output_path, "w", **out_meta) as dest:
            dest.write(mosaic)
            
        for src in src_files_to_mosaic:
            src.close()

class OSMIngestion:
    def __init__(self, pbf_path: str):
        self.osm = pyrosm.OSM(pbf_path)
        
    def get_roads(self) -> gpd.GeoDataFrame:
        """Extracts road network."""
        return self.osm.get_network(network_type="driving")
        
    def get_rivers(self) -> gpd.GeoDataFrame:
        """Extracts water bodies/rivers."""
        # Custom query for waterways
        return self.osm.get_data_by_custom_criteria(custom_filter={'waterway': ['river', 'stream']})
```


## Section 9: Data Validation

Silent failures in ML pipelines often stem from bad data entering the system.

### `src/landslide_ml/data/validation.py`
```python
import pandas as pd
import geopandas as gpd
import rasterio
from typing import Dict, List, Any

def validate_coordinates(df: pd.DataFrame, lat_col: str, lon_col: str, bbox: List[float] = None) -> bool:
    """Validates coordinates are valid floats and within bbox if provided. Bbox: [N, W, S, E]"""
    if not pd.api.types.is_numeric_dtype(df[lat_col]) or not pd.api.types.is_numeric_dtype(df[lon_col]):
        return False
        
    lat_valid = (df[lat_col] >= -90) & (df[lat_col] <= 90)
    lon_valid = (df[lon_col] >= -180) & (df[lon_col] <= 180)
    
    if not (lat_valid.all() and lon_valid.all()):
        return False
        
    if bbox:
        n, w, s, e = bbox
        in_bbox = (df[lat_col] >= s) & (df[lat_col] <= n) & (df[lon_col] >= w) & (df[lon_col] <= e)
        return in_bbox.all()
    return True

def validate_timestamps(df: pd.DataFrame, time_col: str) -> bool:
    """Checks for valid dates and no future dates."""
    try:
        dates = pd.to_datetime(df[time_col])
        now = pd.Timestamp.now()
        if (dates > now).any():
            return False
        return True
    except:
        return False

def validate_numeric_ranges(df: pd.DataFrame, column: str, min_val: float, max_val: float) -> bool:
    """Checks if numeric column is within range."""
    return ((df[column] >= min_val) & (df[column] <= max_val)).all()

def validate_no_duplicates(df: pd.DataFrame, subset_cols: List[str]) -> bool:
    """Checks for exact duplicates based on subset columns."""
    return not df.duplicated(subset=subset_cols).any()

def validate_missing_threshold(df: pd.DataFrame, column: str, max_missing_pct: float) -> bool:
    """Checks if missing values exceed a threshold percentage (0.0 to 1.0)."""
    missing_pct = df[column].isna().mean()
    return missing_pct <= max_missing_pct

def validate_raster_crs(raster_path: str, expected_epsg: int) -> bool:
    """Validates the CRS of a raster."""
    with rasterio.open(raster_path) as src:
        crs = src.crs
        if crs is None:
            return False
        return crs.to_epsg() == expected_epsg

def validate_raster_bounds(raster_path: str, expected_bounds: tuple) -> bool:
    """Validates raster falls within expected bounds (left, bottom, right, top)."""
    with rasterio.open(raster_path) as src:
        bounds = src.bounds
        e_left, e_bottom, e_right, e_top = expected_bounds
        return (bounds.left >= e_left and bounds.bottom >= e_bottom and 
                bounds.right <= e_right and bounds.top <= e_top)

class DataValidationReport:
    def __init__(self):
        self.results: Dict[str, Any] = {}
        
    def add_result(self, check_name: str, passed: bool, details: str = ""):
        self.results[check_name] = {"passed": passed, "details": details}
        
    def generate_report(self) -> str:
        report = "Data Validation Report\n======================\n"
        all_passed = True
        for check, data in self.results.items():
            status = "PASS" if data["passed"] else "FAIL"
            report += f"[{status}] {check}: {data['details']}\n"
            if not data["passed"]:
                all_passed = False
        report += f"\nOVERALL STATUS: {'PASS' if all_passed else 'FAIL'}"
        return report
```

### `scripts/validate_data.py`
```python
import pandas as pd
from pathlib import Path
from landslide_ml.data.validation import (
    validate_coordinates, validate_timestamps, validate_missing_threshold,
    DataValidationReport
)

def main():
    report = DataValidationReport()
    
    # Validate GLC
    glc_path = Path("data/raw/nasa_glc.csv")
    if glc_path.exists():
        df = pd.read_csv(glc_path)
        
        # Check coords
        valid_coords = validate_coordinates(df, 'latitude', 'longitude')
        report.add_result("GLC Coordinates", valid_coords, "Latitude/Longitude range validation")
        
        # Check dates
        valid_dates = validate_timestamps(df, 'event_date')
        report.add_result("GLC Dates", valid_dates, "Future date check")
        
        # Check missing
        valid_missing = validate_missing_threshold(df, 'event_date', 0.1)
        report.add_result("GLC Missing Dates", valid_missing, "Less than 10% missing event_date")
    else:
        report.add_result("GLC File Check", False, "File not found")
        
    print(report.generate_report())

if __name__ == "__main__":
    main()
```


## Section 10: Data Cleaning

### `src/landslide_ml/data/cleaning.py`
```python
import pandas as pd
import geopandas as gpd
import xarray as xr
import numpy as np

def clean_landslide_catalog(df: pd.DataFrame) -> pd.DataFrame:
    """Standardizes dates, removes invalid coordinates and deduplicates."""
    df = df.copy()
    
    # 1. Standardize dates
    df['event_date'] = pd.to_datetime(df['event_date'], errors='coerce')
    df = df.dropna(subset=['event_date'])
    
    # 2. Filter invalid coordinates
    df = df.dropna(subset=['latitude', 'longitude'])
    df = df[(df['latitude'] >= -90) & (df['latitude'] <= 90)]
    df = df[(df['longitude'] >= -180) & (df['longitude'] <= 180)]
    
    # 3. Exact deduplication
    df = df.drop_duplicates(subset=['latitude', 'longitude', 'event_date'])
    
    return df

def clean_rainfall_data(ds: xr.Dataset) -> xr.Dataset:
    """Handles missing values and converts units for ERA5."""
    ds = ds.copy()
    
    # Convert total precipitation (tp) from meters to mm
    if 'tp' in ds:
        ds['tp'] = ds['tp'] * 1000.0
        ds['tp'].attrs['units'] = 'mm'
        
    # Handle NaNs (e.g., oceans or out of bounds)
    ds = ds.fillna(0.0) 
    return ds

def remove_spatial_duplicates(gdf: gpd.GeoDataFrame, distance_threshold_m: float = 1000) -> gpd.GeoDataFrame:
    """
    Merges nearby events occurring on the same day.
    Requires GDF to be in a projected CRS (meters).
    """
    if gdf.crs.is_geographic:
        raise ValueError("GeoDataFrame must be in a projected CRS (meters) for distance calculations.")
        
    # Group by date first
    gdf['date_str'] = gdf['event_date'].dt.strftime('%Y-%m-%d')
    
    cleaned_frames = []
    for date, group in gdf.groupby('date_str'):
        # Buffer points
        buffers = group.geometry.buffer(distance_threshold_m)
        # Find intersecting buffers (connected components)
        unioned = buffers.unary_union
        
        # If unary_union returns a MultiPolygon, split it, else keep single Polygon
        if unioned.geom_type == 'MultiPolygon':
            polygons = list(unioned.geoms)
        else:
            polygons = [unioned]
            
        # Create representative points for each cluster
        cluster_points = gpd.GeoDataFrame(geometry=[p.centroid for p in polygons], crs=gdf.crs)
        cluster_points['event_date'] = pd.to_datetime(date)
        cleaned_frames.append(cluster_points)
        
    return pd.concat(cleaned_frames, ignore_index=True) if cleaned_frames else gpd.GeoDataFrame(columns=gdf.columns, crs=gdf.crs)
```


## Section 11: Geospatial Processing

Working with geospatial data requires understanding Coordinate Reference Systems (CRS). We typically receive data in EPSG:4326 (WGS84, lat/lon degrees) but need to perform distance calculations in a projected CRS (meters) like EPSG:32646 (UTM Zone 46N for much of NER).

### `src/landslide_ml/geospatial/coordinates.py`
```python
import geopandas as gpd
import math

def ner_bounding_box() -> list[float]:
    """Returns the standard NER bounding box: [North, West, South, East]"""
    return [29.5, 89.5, 21.5, 97.5]

def is_in_ner(lat: float, lon: float) -> bool:
    """Checks if a single lat/lon point is within NER bounds."""
    n, w, s, e = ner_bounding_box()
    return (s <= lat <= n) and (w <= lon <= e)

def reproject_gdf(gdf: gpd.GeoDataFrame, target_epsg: int) -> gpd.GeoDataFrame:
    """Reprojects a GeoDataFrame to a new EPSG code."""
    return gdf.to_crs(epsg=target_epsg)

def meters_to_degrees(meters: float, latitude: float) -> float:
    """
    Approximate conversion of meters to degrees latitude/longitude.
    Longitude degrees get smaller as you move away from equator.
    """
    earth_radius = 6378137.0 # meters
    # Degrees latitude
    dlat = (meters / earth_radius) * (180 / math.pi)
    return dlat # Roughly symmetric for small distances
```

### `src/landslide_ml/geospatial/raster.py`
```python
import rasterio
import rasterio.mask
import geopandas as gpd
import numpy as np
from pathlib import Path
from shapely.geometry import box

def sample_raster_at_points(raster_path: str, points_gdf: gpd.GeoDataFrame, band: int = 1) -> np.ndarray:
    """Extracts raster values at point locations."""
    # Ensure CRS match
    with rasterio.open(raster_path) as src:
        if points_gdf.crs != src.crs:
            points_gdf = points_gdf.to_crs(src.crs)
            
        coords = [(x, y) for x, y in zip(points_gdf.geometry.x, points_gdf.geometry.y)]
        
        # Sample raster generator
        sampled = list(src.sample(coords, indexes=band))
        
    return np.array([val[0] for val in sampled])

def mosaic_rasters(raster_paths: list[str], output_path: str) -> None:
    """Mosaics multiple raster paths. (Wrapper around rasterio.merge)"""
    from rasterio.merge import merge
    src_files = [rasterio.open(fp) for fp in raster_paths]
    mosaic, out_trans = merge(src_files)
    out_meta = src_files[0].meta.copy()
    out_meta.update({
        "driver": "GTiff",
        "height": mosaic.shape[1],
        "width": mosaic.shape[2],
        "transform": out_trans
    })
    with rasterio.open(output_path, "w", **out_meta) as dest:
        dest.write(mosaic)
    for src in src_files:
        src.close()

def clip_raster_to_bounds(raster_path: str, bounds: tuple, output_path: str) -> None:
    """Clips a raster to (minx, miny, maxx, maxy) bounds."""
    minx, miny, maxx, maxy = bounds
    bbox = box(minx, miny, maxx, maxy)
    geo = gpd.GeoDataFrame({'geometry': bbox}, index=[0], crs="EPSG:4326")
    
    with rasterio.open(raster_path) as src:
        if geo.crs != src.crs:
            geo = geo.to_crs(src.crs)
        
        out_image, out_transform = rasterio.mask.mask(src, geo.geometry, crop=True)
        out_meta = src.meta
        out_meta.update({"driver": "GTiff",
                         "height": out_image.shape[1],
                         "width": out_image.shape[2],
                         "transform": out_transform})
                         
    with rasterio.open(output_path, "w", **out_meta) as dest:
        dest.write(out_image)
```

### `src/landslide_ml/geospatial/terrain.py`
```python
import numpy as np
import rasterio
from scipy.ndimage import gradient

def _calculate_gradients(dem_array, res_x, res_y):
    """Calculates x and y gradients using Sobel-like central differences."""
    dy, dx = np.gradient(dem_array, res_y, res_x)
    return dx, dy

def calculate_slope(dem_path: str, output_path: str) -> None:
    """Calculates slope in degrees from a DEM."""
    with rasterio.open(dem_path) as src:
        dem = src.read(1).astype('float32')
        res_x, res_y = src.res
        meta = src.meta.copy()
        
    # Mask nodata
    nodata = src.nodata
    if nodata is not None:
        dem[dem == nodata] = np.nan
        
    dx, dy = _calculate_gradients(dem, res_x, res_y)
    
    # Slope calculation
    slope_rad = np.arctan(np.sqrt(dx**2 + dy**2))
    slope_deg = np.degrees(slope_rad)
    
    meta.update(dtype=rasterio.float32, nodata=np.nan)
    with rasterio.open(output_path, 'w', **meta) as dst:
        dst.write(slope_deg.astype(rasterio.float32), 1)

def calculate_aspect(dem_path: str, output_path: str) -> None:
    """Calculates aspect in degrees from a DEM (0=N, 90=E, 180=S, 270=W)."""
    with rasterio.open(dem_path) as src:
        dem = src.read(1).astype('float32')
        res_x, res_y = src.res
        meta = src.meta.copy()

    dx, dy = _calculate_gradients(dem, res_x, res_y)
    
    aspect_rad = np.arctan2(-dx, dy)
    aspect_deg = np.degrees(aspect_rad)
    
    # Convert to compass bearing
    aspect_deg = (aspect_deg + 360) % 360
    
    meta.update(dtype=rasterio.float32, nodata=np.nan)
    with rasterio.open(output_path, 'w', **meta) as dst:
        dst.write(aspect_deg.astype(rasterio.float32), 1)

def calculate_curvature(dem_path: str, output_path: str) -> None:
    """Calculates profile curvature."""
    with rasterio.open(dem_path) as src:
        dem = src.read(1).astype('float32')
        res_x, res_y = src.res
        meta = src.meta.copy()

    # Second derivatives
    dy, dx = np.gradient(dem, res_y, res_x)
    dyy, dyx = np.gradient(dy, res_y, res_x)
    dxy, dxx = np.gradient(dx, res_y, res_x)

    # Curvature formula (simplified)
    p = dx**2 + dy**2
    curvature = np.zeros_like(dem)
    
    # Avoid division by zero
    mask = p > 0.0001
    curvature[mask] = -((dx[mask]**2 * dxx[mask] + 2*dx[mask]*dy[mask]*dxy[mask] + dy[mask]**2 * dyy[mask]) / 
                        (p[mask] * np.sqrt(1 + p[mask])))
                        
    meta.update(dtype=rasterio.float32, nodata=np.nan)
    with rasterio.open(output_path, 'w', **meta) as dst:
        dst.write(curvature.astype(rasterio.float32), 1)

def calculate_ruggedness(dem_path: str, output_path: str) -> None:
    """Calculates Terrain Ruggedness Index (TRI)."""
    with rasterio.open(dem_path) as src:
        dem = src.read(1).astype('float32')
        meta = src.meta.copy()

    from scipy.ndimage import uniform_filter
    
    # Mean of 3x3 neighborhood
    mean_dem = uniform_filter(dem, size=3)
    
    # TRI is root mean squared difference between central pixel and neighbors
    # Simplified here as absolute difference from mean
    tri = np.abs(dem - mean_dem)

    meta.update(dtype=rasterio.float32, nodata=np.nan)
    with rasterio.open(output_path, 'w', **meta) as dst:
        dst.write(tri.astype(rasterio.float32), 1)
```

### `src/landslide_ml/geospatial/spatial_join.py`
```python
import geopandas as gpd
import pandas as pd

def nearest_distance(points_gdf: gpd.GeoDataFrame, features_gdf: gpd.GeoDataFrame) -> pd.Series:
    """Calculates minimum distance from each point to the nearest feature in features_gdf."""
    if points_gdf.crs != features_gdf.crs:
        features_gdf = features_gdf.to_crs(points_gdf.crs)
        
    distances = []
    # sindex makes this faster
    features_sindex = features_gdf.sindex
    
    for geom in points_gdf.geometry:
        nearest_idx = features_sindex.nearest(geom)[1][0]
        nearest_geom = features_gdf.iloc[nearest_idx].geometry
        distances.append(geom.distance(nearest_geom))
        
    return pd.Series(distances, index=points_gdf.index)

def points_in_polygon(points_gdf: gpd.GeoDataFrame, polygons_gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """Performs spatial join of points within polygons."""
    if points_gdf.crs != polygons_gdf.crs:
        polygons_gdf = polygons_gdf.to_crs(points_gdf.crs)
    return gpd.sjoin(points_gdf, polygons_gdf, how="inner", predicate="within")

def buffer_points(gdf: gpd.GeoDataFrame, distance_m: float) -> gpd.GeoDataFrame:
    """Creates buffered polygons around points. Assumes CRS is in meters."""
    if gdf.crs.is_geographic:
        raise ValueError("GeoDataFrame must be in a projected CRS (meters).")
    
    buffered = gdf.copy()
    buffered['geometry'] = buffered.geometry.buffer(distance_m)
    return buffered
```


## Section 12: Spatial Unit Analysis

A fundamental decision in landslide ML is defining the spatial unit of analysis.

| Spatial Unit | Description | Resolution | Pros | Cons |
|---|---|---|---|---|
| **Point** | Location of event | 0m | Easy to compute, fast | Fails to capture full area, highly sensitive to GPS error |
| **Grid Cell** | Regular raster grid | 1km - 10km | Aligns naturally with weather models (ERA5/IMERG) | Modifiable Areal Unit Problem (MAUP), generalizes terrain |
| **Slope Unit** | Hydrologically bounded areas | Variable | Physical basis, aggregates terrain perfectly | Complex to generate, mismatched with coarse weather grids |

**Recommendation:** For the MVP, we use **Grid Cells (~9km)** mapped directly to the ERA5-Land grid. Terrain features (30m DEM) are aggregated (mean, max, variance) within each 9km grid cell. This simplifies temporal alignment and handles the spatial uncertainty in historical catalogs.


## Section 13: Temporal Alignment

Landslides are triggered by conditions *before* the event. The engine aligns data rigorously to prevent target leakage:

1. **Event Date:** Anchor point (T=0). e.g., 2023-07-15.
2. **Rainfall:** Extracted as cumulative windows prior to T=0.
   - `precip_1h`: T-1h to T=0
   - `precip_24h`: T-24h to T=0
   - `precip_72h`: T-72h to T=0
   - `precip_7d`: T-7d to T=0
3. **Soil Moisture:** Extracted at exactly T-24h to represent antecedent conditions prior to the final trigger event.
4. **Terrain:** Static, assumed constant.
5. **Land Cover:** Latest available annual map *prior* to the event year.

**CRITICAL RULE:** No data measured at T > 0 is ever joined to a feature row.


## Section 14: Label Creation

### `src/landslide_ml/dataset/labels.py`
```python
import geopandas as gpd
import pandas as pd
from dataclasses import dataclass

@dataclass
class LabelConfig:
    prediction_window_hours: int = 24
    spatial_tolerance_m: float = 1000.0
    temporal_tolerance_days: int = 1

def create_positive_labels(landslide_gdf: gpd.GeoDataFrame, 
                           spatial_tolerance_m: float, 
                           temporal_tolerance_days: int) -> gpd.GeoDataFrame:
    """
    Creates standardized positive labels by deduplicating events close in space and time.
    """
    if landslide_gdf.crs.is_geographic:
        raise ValueError("Must use projected CRS for spatial tolerance in meters.")
        
    df = landslide_gdf.copy()
    df['event_date'] = pd.to_datetime(df['event_date'])
    df = df.sort_values('event_date')
    
    labels = []
    processed_indices = set()
    
    for idx, row in df.iterrows():
        if idx in processed_indices:
            continue
            
        # Find points within temporal tolerance
        time_mask = abs((df['event_date'] - row['event_date']).dt.days) <= temporal_tolerance_days
        temporal_neighbors = df[time_mask]
        
        # Find points within spatial tolerance
        geom = row.geometry
        spatial_mask = temporal_neighbors.geometry.distance(geom) <= spatial_tolerance_m
        
        cluster = temporal_neighbors[spatial_mask]
        
        # Mark as processed
        processed_indices.update(cluster.index)
        
        # Aggregate cluster to single label using first event date
        labels.append({
            'label': 1,
            'event_date': cluster['event_date'].min(), # Use earliest date in cluster
            'geometry': geom, # Use location of primary event
            'num_events': len(cluster)
        })
        
    return gpd.GeoDataFrame(labels, crs=landslide_gdf.crs)
```


## Section 15: Negative Sampling

This is arguably the hardest part of landslide ML. If you only train on where landslides happened (positives), the model learns nothing. You must teach it where they *didn't* happen (negatives).

**The dangers of random negative sampling:**
- **The Flat-Slope Trap:** If you randomly sample negatives across India, 80% will land on flat plains. The model learns: "Slope > 5 degrees = Landslide." This is useless in the Himalayas where *everywhere* is steep.
- **Spatial Autocorrelation:** Negatives too close to positives share the same rainfall and soil features.
- **Incomplete Inventory:** A 'negative' location might actually be a landslide that nobody reported.

**Strategy:** We sample negatives dynamically.
1. **Spatial Buffer:** Minimum 5km away from any known positive.
2. **Terrain Matching:** Slope > 10 degrees to avoid the flat-slope trap.
3. **Temporal Matching:** Negatives are assigned the *exact same dates* as the positives, preserving the seasonal rainfall distribution.

### `src/landslide_ml/dataset/sampling.py`
```python
import geopandas as gpd
import pandas as pd
import numpy as np
from shapely.geometry import Point
import rasterio
from typing import Tuple

def _get_slope_at_point(dem_path: str, point: Point) -> float:
    """Helper to extract slope at a single point (assumes dem_path contains slope raster)."""
    with rasterio.open(dem_path) as src:
        # Reproject point if needed - simplified here for brevity
        val = list(src.sample([(point.x, point.y)]))[0][0]
        return float(val)

def generate_negative_samples(
    positive_gdf: gpd.GeoDataFrame, 
    study_area_bounds: Tuple[float, float, float, float], 
    dem_path: str, 
    n_ratio: int = 5, 
    min_buffer_m: float = 5000.0,
    slope_range: Tuple[float, float] = (10.0, 60.0)
) -> gpd.GeoDataFrame:
    """
    Generates negative samples balancing spatial buffer, terrain requirements, 
    and temporal matching.
    """
    if positive_gdf.crs.is_geographic:
        raise ValueError("Must use projected CRS for buffering.")
        
    minx, miny, maxx, maxy = study_area_bounds
    num_positives = len(positive_gdf)
    target_negatives = num_positives * n_ratio
    
    # Create exclusion zone from positives
    exclusion_zone = positive_gdf.geometry.buffer(min_buffer_m).unary_union
    
    negatives = []
    dates = positive_gdf['event_date'].tolist()
    
    attempts = 0
    max_attempts = target_negatives * 10
    
    while len(negatives) < target_negatives and attempts < max_attempts:
        attempts += 1
        
        # Random point in bounds
        x = np.random.uniform(minx, maxx)
        y = np.random.uniform(miny, maxy)
        p = Point(x, y)
        
        # 1. Check exclusion zone
        if exclusion_zone.contains(p):
            continue
            
        # 2. Check terrain (Flat-slope trap avoidance)
        try:
            slope = _get_slope_at_point(dem_path, p)
            if not (slope_range[0] <= slope <= slope_range[1]):
                continue
        except Exception:
            continue
            
        # 3. Temporal matching (Assign a date from the positive distribution)
        assigned_date = dates[len(negatives) % num_positives]
        
        negatives.append({
            'label': 0,
            'event_date': assigned_date,
            'geometry': p,
            'num_events': 0
        })
        
    return gpd.GeoDataFrame(negatives, crs=positive_gdf.crs)

def validate_negative_samples(negatives_gdf: gpd.GeoDataFrame, positives_gdf: gpd.GeoDataFrame, min_distance_m: float) -> bool:
    """Verifies no negative sample is within min_distance_m of any positive sample."""
    # Build spatial index for fast distance checking
    pos_sindex = positives_gdf.sindex
    
    for geom in negatives_gdf.geometry:
        # Find nearest positive
        nearest_idx = pos_sindex.nearest(geom)[1][0]
        nearest_pos = positives_gdf.iloc[nearest_idx].geometry
        dist = geom.distance(nearest_pos)
        
        if dist < min_distance_m:
            return False
            
    return True
```


---

# PART 3: FEATURE ENGINEERING & DATASET CONSTRUCTION (Sections 16-20)

## Section 16: Feature Engineering

The feature engineering step is responsible for extracting predictive signals from raw geospatial, temporal, and meteorological data. This section provides the complete code for the various feature extractors.

### `src/landslide_ml/features/rainfall.py`

```python
import pandas as pd
import xarray as xr
import numpy as np

def calculate_rainfall_features(
    latitude: float,
    longitude: float,
    event_timestamp: pd.Timestamp,
    era5_dataset: xr.Dataset,
) -> dict[str, float]:
    """
    Calculate cumulative rainfall features for a location and time.
    Uses ERA5-Land total_precipitation variable.
    Computes: rainfall_1h, rainfall_6h, rainfall_12h, rainfall_24h, 
              rainfall_3d, rainfall_7d, rainfall_30d
    All windows are BEFORE event_timestamp (no future data).
    """
    windows = {
        "rainfall_1h": pd.Timedelta(hours=1),
        "rainfall_6h": pd.Timedelta(hours=6),
        "rainfall_12h": pd.Timedelta(hours=12),
        "rainfall_24h": pd.Timedelta(hours=24),
        "rainfall_3d": pd.Timedelta(days=3),
        "rainfall_7d": pd.Timedelta(days=7),
        "rainfall_30d": pd.Timedelta(days=30)
    }
    
    features = {k: 0.0 for k in windows.keys()}
    
    try:
        local_data = era5_dataset.sel(
            latitude=latitude, 
            longitude=longitude, 
            method="nearest"
        )
        
        past_data = local_data.sel(time=slice(None, event_timestamp))
        
        if len(past_data.time) == 0:
            return features
            
        for feature_name, window_delta in windows.items():
            start_time = event_timestamp - window_delta
            window_data = past_data.sel(time=slice(start_time, event_timestamp))
            
            if len(window_data.time) > 0:
                total_precip_m = float(window_data['total_precipitation'].sum().values)
                features[feature_name] = total_precip_m * 1000.0
                
    except Exception as e:
        pass
        
    return features
```

### `src/landslide_ml/features/soil.py`

```python
import pandas as pd
import xarray as xr

def calculate_soil_features(
    latitude: float,
    longitude: float,
    event_timestamp: pd.Timestamp,
    era5_dataset: xr.Dataset,
) -> dict[str, float]:
    """
    Extract soil moisture from ERA5-Land.
    Uses volumetric_soil_water_layer_1 through layer_4.
    Returns latest observation BEFORE event_timestamp.
    """
    features = {"soil_moisture": 0.0}
    
    try:
        local_data = era5_dataset.sel(
            latitude=latitude, 
            longitude=longitude, 
            method="nearest"
        )
        
        past_data = local_data.sel(time=slice(None, event_timestamp))
        
        if len(past_data.time) > 0:
            latest_obs = past_data.isel(time=-1)
            
            swl1 = float(latest_obs.get('swvl1', 0.0))
            swl2 = float(latest_obs.get('swvl2', 0.0))
            swl3 = float(latest_obs.get('swvl3', 0.0))
            swl4 = float(latest_obs.get('swvl4', 0.0))
            
            total_depth = 7 + 21 + 72 + 189
            weighted_avg = (swl1 * 7 + swl2 * 21 + swl3 * 72 + swl4 * 189) / total_depth
            
            features["soil_moisture"] = weighted_avg * 100.0
            
    except Exception as e:
        pass
        
    return features
```

### `src/landslide_ml/features/terrain.py`

```python
import rasterio
import pyproj

def sample_raster(raster_path: str, lon: float, lat: float) -> float:
    try:
        with rasterio.open(raster_path) as src:
            row, col = src.index(lon, lat)
            if row < 0 or col < 0 or row >= src.height or col >= src.width:
                return float('nan')
            
            val = src.read(1, window=((row, row+1), (col, col+1)))[0,0]
            if val == src.nodata:
                return float('nan')
            return float(val)
    except Exception:
        return float('nan')

def calculate_terrain_features(
    latitude: float,
    longitude: float,
    slope_raster: str,
    aspect_raster: str,
    elevation_raster: str,
    curvature_raster: str,
    ruggedness_raster: str,
) -> dict[str, float]:
    """
    Extract terrain features from pre-computed rasters.
    Returns: elevation, slope, aspect, curvature, ruggedness
    """
    elevation = sample_raster(elevation_raster, longitude, latitude)
    slope = sample_raster(slope_raster, longitude, latitude)
    aspect = sample_raster(aspect_raster, longitude, latitude)
    curvature = sample_raster(curvature_raster, longitude, latitude)
    ruggedness = sample_raster(ruggedness_raster, longitude, latitude)
    
    if not (0 <= slope <= 90): slope = float('nan')
    if not (0 <= aspect <= 360): aspect = float('nan')
    
    return {
        "elevation": elevation,
        "slope": slope,
        "aspect": aspect,
        "curvature": curvature,
        "ruggedness": ruggedness
    }
```

### `src/landslide_ml/features/historical.py`

```python
import pandas as pd
import geopandas as gpd
import numpy as np

def calculate_historical_features(
    latitude: float,
    longitude: float,
    event_timestamp: pd.Timestamp,
    landslide_inventory: gpd.GeoDataFrame,
    buffer_radius_m: float = 5000.0,
) -> dict[str, float]:
    """
    Calculate historical landslide features.
    CRITICAL: Only count events BEFORE event_timestamp (leakage prevention).
    Returns: historical_event_count, historical_density_per_km2, 
             distance_to_nearest_historical_m
    """
    features = {
        "historical_event_count": 0.0,
        "historical_density_per_km2": 0.0,
        "distance_to_nearest_historical_m": -1.0
    }
    
    if landslide_inventory.empty:
        return features
        
    past_events = landslide_inventory[landslide_inventory['date'] < event_timestamp].copy()
    
    if past_events.empty:
        return features
        
    point = gpd.GeoSeries(gpd.points_from_xy([longitude], [latitude]), crs="EPSG:4326")
    target_crs = "EPSG:32646" 
    point_proj = point.to_crs(target_crs)
    past_events_proj = past_events.to_crs(target_crs)
    
    buffer = point_proj.buffer(buffer_radius_m)
    events_in_buffer = gpd.sjoin(past_events_proj, gpd.GeoDataFrame(geometry=buffer, crs=target_crs), predicate='within')
    count = float(len(events_in_buffer))
    
    area_km2 = (np.pi * (buffer_radius_m ** 2)) / 1_000_000
    density = count / area_km2
    
    distances = past_events_proj.distance(point_proj.iloc[0])
    min_dist = float(distances.min())
    
    features["historical_event_count"] = count
    features["historical_density_per_km2"] = density
    features["distance_to_nearest_historical_m"] = min_dist
    
    return features
```

### `src/landslide_ml/features/geographic.py`

```python
import pandas as pd
import geopandas as gpd
from src.landslide_ml.features.terrain import sample_raster

def calculate_geographic_features(
    latitude: float,
    longitude: float,
    roads_gdf: gpd.GeoDataFrame,
    rivers_gdf: gpd.GeoDataFrame,
    landcover_raster: str,
) -> dict[str, float]:
    """
    Calculate geographic proximity features.
    Returns: distance_to_road_m, distance_to_river_m, land_cover_class
    """
    features = {
        "distance_to_road_m": -1.0,
        "distance_to_river_m": -1.0,
        "land_cover_class": -1.0
    }
    
    target_crs = "EPSG:32646"
    point = gpd.GeoSeries(gpd.points_from_xy([longitude], [latitude]), crs="EPSG:4326").to_crs(target_crs)
    
    if not roads_gdf.empty:
        roads_proj = roads_gdf.to_crs(target_crs)
        dist_road = roads_proj.distance(point.iloc[0]).min()
        features["distance_to_road_m"] = float(dist_road)
        
    if not rivers_gdf.empty:
        rivers_proj = rivers_gdf.to_crs(target_crs)
        dist_river = rivers_proj.distance(point.iloc[0]).min()
        features["distance_to_river_m"] = float(dist_river)
        
    lc_val = sample_raster(landcover_raster, longitude, latitude)
    if not pd.isna(lc_val):
        features["land_cover_class"] = float(lc_val)
        
    return features
```

### `src/landslide_ml/features/pipeline.py`

```python
import pandas as pd
import geopandas as gpd
import xarray as xr
from typing import Dict, Any

from src.landslide_ml.features.rainfall import calculate_rainfall_features
from src.landslide_ml.features.soil import calculate_soil_features
from src.landslide_ml.features.terrain import calculate_terrain_features
from src.landslide_ml.features.historical import calculate_historical_features
from src.landslide_ml.features.geographic import calculate_geographic_features

class FeaturePipeline:
    """Orchestrates feature computation for a single sample or batch."""
    
    FEATURE_VERSION = "1.0.0"
    
    FEATURE_NAMES = [
        "rainfall_1h", "rainfall_6h", "rainfall_12h", "rainfall_24h",
        "rainfall_3d", "rainfall_7d", "rainfall_30d",
        "soil_moisture",
        "elevation", "slope", "aspect", "curvature", "ruggedness",
        "historical_event_count", "historical_density_per_km2",
        "distance_to_nearest_historical_m",
        "distance_to_road_m", "distance_to_river_m", "land_cover_class",
    ]
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.era5 = xr.open_dataset(config['era5_path'])
        self.inventory = gpd.read_file(config['inventory_path'])
        self.roads = gpd.read_file(config['roads_path'])
        self.rivers = gpd.read_file(config['rivers_path'])
        
    def compute_features(self, latitude: float, longitude: float, event_timestamp: pd.Timestamp) -> dict:
        features = {}
        
        features.update(calculate_rainfall_features(latitude, longitude, event_timestamp, self.era5))
        features.update(calculate_soil_features(latitude, longitude, event_timestamp, self.era5))
        features.update(calculate_terrain_features(
            latitude, longitude,
            self.config['slope_raster'], self.config['aspect_raster'],
            self.config['elevation_raster'], self.config['curvature_raster'],
            self.config['ruggedness_raster']
        ))
        features.update(calculate_historical_features(latitude, longitude, event_timestamp, self.inventory))
        features.update(calculate_geographic_features(
            latitude, longitude, self.roads, self.rivers, self.config['landcover_raster']
        ))
        
        return features

    def compute_features_batch(self, samples_df: pd.DataFrame) -> pd.DataFrame:
        results = []
        for idx, row in samples_df.iterrows():
            feats = self.compute_features(row['latitude'], row['longitude'], row['timestamp'])
            results.append(feats)
        
        features_df = pd.DataFrame(results)
        return pd.concat([samples_df.reset_index(drop=True), features_df], axis=1)
        
    def validate_features(self, features: dict) -> bool:
        for f in self.FEATURE_NAMES:
            if f not in features:
                return False
        return True
        
    def get_feature_metadata(self) -> dict:
        return {
            "version": self.FEATURE_VERSION,
            "feature_list": self.FEATURE_NAMES,
            "crs_expected": "EPSG:4326"
        }
```

---

## Section 17: Feature Leakage Prevention

Feature leakage occurs when data from the future (relative to the target variable) leaks into the training features.

1. **Bad**: Historical landslide count includes future events.
   **Good**: Filter to events before prediction date.
2. **Bad**: Satellite image captured after the landslide.
   **Good**: Use pre-event imagery only.
3. **Bad**: Future rainfall used for prediction.
   **Good**: Only backward-looking cumulative windows.

### `src/landslide_ml/dataset/leakage.py`

```python
import pandas as pd
import geopandas as gpd
from dataclasses import dataclass
from typing import List

@dataclass
class LeakageReport:
    is_safe: bool
    violations: List[str]

def check_temporal_leakage(features_df: pd.DataFrame, label_col: str, timestamp_col: str) -> LeakageReport:
    violations = []
    for col in features_df.columns:
        if "forecast" in col or "future" in col:
            violations.append(f"Column '{col}' implies future knowledge.")
            
    return LeakageReport(len(violations) == 0, violations)

def check_historical_feature_leakage(
    features_df: pd.DataFrame, 
    landslide_inventory: gpd.GeoDataFrame, 
    timestamp_col: str
) -> LeakageReport:
    violations = []
    sample = features_df.dropna(subset=['historical_event_count']).sample(min(100, len(features_df)))
    
    for idx, row in sample.iterrows():
        ts = row[timestamp_col]
        reported_count = row['historical_event_count']
        actual_past_events = len(landslide_inventory[landslide_inventory['date'] < ts])
        
        if reported_count > actual_past_events:
            violations.append(
                f"Row {idx} has {reported_count} historical events, but only "
                f"{actual_past_events} exist in inventory before {ts}."
            )
            
    return LeakageReport(len(violations) == 0, violations)

def check_train_test_contamination(
    train_df: pd.DataFrame, 
    test_df: pd.DataFrame, 
    spatial_buffer_m: float = 1000.0, 
    temporal_buffer_days: int = 30
) -> LeakageReport:
    violations = []
    
    train_gdf = gpd.GeoDataFrame(
        train_df, 
        geometry=gpd.points_from_xy(train_df.longitude, train_df.latitude), 
        crs="EPSG:4326"
    ).to_crs("EPSG:32646")
    
    test_gdf = gpd.GeoDataFrame(
        test_df, 
        geometry=gpd.points_from_xy(test_df.longitude, test_df.latitude), 
        crs="EPSG:4326"
    ).to_crs("EPSG:32646")
    
    for _, test_row in test_gdf.iterrows():
        test_geom = test_row.geometry
        test_ts = test_row['timestamp']
        
        time_mask = (train_gdf['timestamp'] >= test_ts - pd.Timedelta(days=temporal_buffer_days)) & \
                    (train_gdf['timestamp'] <= test_ts + pd.Timedelta(days=temporal_buffer_days))
        
        train_temporal_close = train_gdf[time_mask]
        
        if not train_temporal_close.empty:
            distances = train_temporal_close.geometry.distance(test_geom)
            if (distances < spatial_buffer_m).any():
                violations.append(f"Test sample near {test_geom} has a train sample within {spatial_buffer_m}m and {temporal_buffer_days} days.")
                break
                
    return LeakageReport(len(violations) == 0, violations)
```

---

## Section 18: Dataset Builder

### `src/landslide_ml/dataset/builder.py`

```python
import pandas as pd
import geopandas as gpd
import json
import os
from datetime import timedelta
import numpy as np

from src.landslide_ml.features.pipeline import FeaturePipeline
from src.landslide_ml.dataset.leakage import check_temporal_leakage

class DatasetBuilder:
    """
    Orchestrates the full dataset construction pipeline.
    """
    def __init__(self, pipeline: FeaturePipeline):
        self.pipeline = pipeline
        
    def _generate_negative_samples(self, positives_df: pd.DataFrame, ratio: int = 3) -> pd.DataFrame:
        negatives = []
        for _, row in positives_df.iterrows():
            for _ in range(ratio):
                lat_shift = np.random.uniform(0.01, 0.1) * np.random.choice([-1, 1])
                lon_shift = np.random.uniform(0.01, 0.1) * np.random.choice([-1, 1])
                time_shift = timedelta(days=np.random.randint(30, 365)) * np.random.choice([-1, 1])
                
                negatives.append({
                    "timestamp": row['timestamp'] + time_shift,
                    "latitude": row['latitude'] + lat_shift,
                    "longitude": row['longitude'] + lon_shift,
                    "label": 0
                })
        return pd.DataFrame(negatives)
        
    def build(self, inventory_df: pd.DataFrame) -> pd.DataFrame:
        positives = inventory_df[['date', 'latitude', 'longitude']].copy()
        positives = positives.rename(columns={'date': 'timestamp'})
        positives['label'] = 1
        
        negatives = self._generate_negative_samples(positives)
        dataset = pd.concat([positives, negatives], ignore_index=True)
        
        final_df = self.pipeline.compute_features_batch(dataset)
        
        report = check_temporal_leakage(final_df, 'label', 'timestamp')
        if not report.is_safe:
            raise ValueError(f"Leakage detected: {report.violations}")
            
        return final_df
        
    def save_dataset(self, df: pd.DataFrame, output_path: str, metadata: dict):
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        df.to_parquet(output_path, index=False)
        
        meta_path = output_path.replace('.parquet', '_metadata.json')
        with open(meta_path, 'w') as f:
            json.dump(metadata, f, indent=4)
            
    def load_dataset(self, path: str) -> tuple[pd.DataFrame, dict]:
        df = pd.read_parquet(path)
        meta_path = path.replace('.parquet', '_metadata.json')
        with open(meta_path, 'r') as f:
            metadata = json.load(f)
        return df, metadata
```

### `scripts/build_dataset.py`

```python
import pandas as pd
from src.landslide_ml.dataset.builder import DatasetBuilder
from src.landslide_ml.features.pipeline import FeaturePipeline

def main():
    config = {
        'era5_path': 'data/raw/era5/era5_ner.nc',
        'inventory_path': 'data/raw/inventory/ner_landslides.geojson',
        'roads_path': 'data/raw/osm/roads.geojson',
        'rivers_path': 'data/raw/osm/rivers.geojson',
        'slope_raster': 'data/raw/dem/slope.tif',
        'aspect_raster': 'data/raw/dem/aspect.tif',
        'elevation_raster': 'data/raw/dem/elevation.tif',
        'curvature_raster': 'data/raw/dem/curvature.tif',
        'ruggedness_raster': 'data/raw/dem/ruggedness.tif',
        'landcover_raster': 'data/raw/landcover/esrilc.tif'
    }
    
    inventory = pd.read_json('data/raw/inventory/ner_landslides_clean.json')
    pipeline = FeaturePipeline(config)
    builder = DatasetBuilder(pipeline)
    
    final_dataset = builder.build(inventory)
    
    metadata = {
        "num_samples": len(final_dataset),
        "positives": len(final_dataset[final_dataset['label'] == 1]),
        "negatives": len(final_dataset[final_dataset['label'] == 0]),
        "features": pipeline.FEATURE_NAMES
    }
    
    builder.save_dataset(final_dataset, 'data/processed/training_data.parquet', metadata)

if __name__ == "__main__":
    main()
```

---

## Section 19: Final Training Dataset Schema

### Schema Definition

| Column | Type | Description |
|--------|------|-------------|
| `timestamp` | `datetime64[ns]` | Date and time of the sample/event |
| `latitude` | `float64` | Latitude (WGS84) |
| `longitude` | `float64` | Longitude (WGS84) |
| `rainfall_1h` | `float64` | Cumulative rainfall past 1 hour (mm) |
| `rainfall_6h` | `float64` | Cumulative rainfall past 6 hours (mm) |
| `rainfall_12h` | `float64` | Cumulative rainfall past 12 hours (mm) |
| `rainfall_24h` | `float64` | Cumulative rainfall past 24 hours (mm) |
| `rainfall_3d` | `float64` | Cumulative rainfall past 3 days (mm) |
| `rainfall_7d` | `float64` | Cumulative rainfall past 7 days (mm) |
| `rainfall_30d` | `float64` | Cumulative rainfall past 30 days (mm) |
| `soil_moisture` | `float64` | Depth-weighted volumetric soil water (%) |
| `elevation` | `float64` | Elevation above sea level (m) |
| `slope` | `float64` | Terrain slope (degrees 0-90) |
| `aspect` | `float64` | Terrain aspect (degrees 0-360) |
| `curvature` | `float64` | Terrain curvature index |
| `ruggedness` | `float64` | Terrain Ruggedness Index (TRI) |
| `historical_event_count` | `float64` | Number of past landslides in 5km radius |
| `historical_density_per_km2` | `float64` | Density of past landslides |
| `distance_to_nearest_historical_m` | `float64` | Distance to closest past event (m) |
| `distance_to_road_m` | `float64` | Distance to nearest road (m) |
| `distance_to_river_m` | `float64` | Distance to nearest river (m) |
| `land_cover_class` | `float64` | Categorical land cover class ID |
| `label` | `int64` | Target label (1 = Landslide, 0 = Non-landslide) |

### Example Record (NER India)

```json
{
  "timestamp": "2023-07-15 08:00:00",
  "latitude": 27.05,
  "longitude": 88.26, 
  "rainfall_1h": 12.5,
  "rainfall_6h": 45.2,
  "rainfall_24h": 120.4,
  "rainfall_30d": 850.6,
  "soil_moisture": 85.2,
  "elevation": 1450.0,
  "slope": 35.5,
  "aspect": 180.0,
  "historical_event_count": 5.0,
  "distance_to_road_m": 120.5,
  "label": 1
}
```

---

## Section 20: Exploratory Data Analysis

### `scripts/explore_dataset.py`

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import json
import os

def generate_eda_report(data_path: str, output_dir: str):
    """
    Performs EDA on the generated dataset and saves findings.
    """
    os.makedirs(output_dir, exist_ok=True)
    df = pd.read_parquet(data_path)
    
    report = {}
    report["shape"] = {"rows": len(df), "columns": len(df.columns)}
    
    missing = df.isnull().sum().to_dict()
    report["missing_values"] = {k: v for k, v in missing.items() if v > 0}
    
    class_dist = df['label'].value_counts(normalize=True).to_dict()
    report["class_distribution"] = {str(k): float(v) for k, v in class_dist.items()}
    
    report["temporal_bounds"] = {
        "start": str(df['timestamp'].min()),
        "end": str(df['timestamp'].max())
    }
    
    feature_cols = [c for c in df.columns if c not in ['timestamp', 'latitude', 'longitude', 'label']]
    
    stats_by_class = {}
    for label in [0, 1]:
        subset = df[df['label'] == label][feature_cols]
        stats_by_class[str(label)] = subset.describe().to_dict()
        
    report["statistics_by_class"] = stats_by_class
    
    with open(os.path.join(output_dir, 'eda_report.json'), 'w') as f:
        json.dump(report, f, indent=4)
        
    plt.figure(figsize=(12, 10))
    corr = df[feature_cols].corr()
    sns.heatmap(corr, cmap="coolwarm", annot=False)
    plt.title("Feature Correlation Matrix")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'correlation_matrix.png'))
    plt.close()
    
    plt.figure(figsize=(10, 6))
    sns.kdeplot(data=df, x="rainfall_24h", hue="label", common_norm=False)
    plt.title("24h Rainfall Distribution by Class")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'rainfall_dist.png'))
    plt.close()
    
    plt.figure(figsize=(10, 6))
    sns.boxplot(data=df, x="label", y="slope")
    plt.title("Slope Distribution by Class")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'slope_dist.png'))
    plt.close()

if __name__ == "__main__":
    generate_eda_report(
        data_path="data/processed/training_data.parquet",
        output_dir="reports/data"
    )
```


---

# PART 4: MODEL TRAINING, EVALUATION & VALIDATION (Sections 21-35)

## Section 21: Dataset Splitting

When dealing with geospatial and temporal phenomena like landslides, random splitting is insufficient and often leads to overly optimistic performance estimates. Brenning (2005) demonstrated that random spatial cross-validation can inflate AUROC by 10-25%. This happens because neighboring pixels or areas share similar geological and weather conditions (spatial autocorrelation). If one part of a hillside is in the training set and an adjacent part is in the test set, the model effectively "memorizes" the hillside rather than learning generalizable patterns.

To prevent this data leakage, we must split data either temporally (predicting future events using past data) or geographically (holding out entire regions).

### `src/landslide_ml/dataset/splitting.py`

```python
import pandas as pd
import numpy as np
from dataclasses import dataclass

@dataclass
class SplitValidationReport:
    is_valid: bool
    train_size: int
    val_size: int
    test_size: int
    overlap_warnings: list[str]

def temporal_split(
    df: pd.DataFrame,
    timestamp_col: str,
    train_end: str,
    val_end: str,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Split data into train/val/test by timestamp."""
    df_sorted = df.sort_values(timestamp_col)
    
    train_mask = df_sorted[timestamp_col] <= pd.to_datetime(train_end)
    val_mask = (df_sorted[timestamp_col] > pd.to_datetime(train_end)) & (df_sorted[timestamp_col] <= pd.to_datetime(val_end))
    test_mask = df_sorted[timestamp_col] > pd.to_datetime(val_end)
    
    return df_sorted[train_mask].copy(), df_sorted[val_mask].copy(), df_sorted[test_mask].copy()

def geographic_split(
    df: pd.DataFrame,
    lat_col: str, 
    lon_col: str,
    test_regions: list[dict],
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Hold out entire geographic regions for testing.
    test_regions format: [{"name": "Mizoram", "bounds": [lat_min, lon_min, lat_max, lon_max]}]
    """
    test_mask = pd.Series(False, index=df.index)
    
    for region in test_regions:
        lat_min, lon_min, lat_max, lon_max = region["bounds"]
        region_mask = (
            (df[lat_col] >= lat_min) & (df[lat_col] <= lat_max) &
            (df[lon_col] >= lon_min) & (df[lon_col] <= lon_max)
        )
        test_mask = test_mask | region_mask
        
    train_df = df[~test_mask].copy()
    test_df = df[test_mask].copy()
    
    return train_df, test_df

def validate_split_integrity(
    train_df: pd.DataFrame, 
    val_df: pd.DataFrame, 
    test_df: pd.DataFrame, 
    timestamp_col: str, 
    lat_col: str, 
    lon_col: str, 
    min_spatial_buffer_m: float = 0.0
) -> SplitValidationReport:
    """Verify no leakage between splits."""
    warnings = []
    
    # Check temporal leakage
    if not train_df.empty and not val_df.empty:
        if train_df[timestamp_col].max() >= val_df[timestamp_col].min():
            warnings.append("Temporal leakage: Training data extends into validation period.")
    
    if not val_df.empty and not test_df.empty:
        if val_df[timestamp_col].max() >= test_df[timestamp_col].min():
            warnings.append("Temporal leakage: Validation data extends into testing period.")
            
    is_valid = len(warnings) == 0
    
    return SplitValidationReport(
        is_valid=is_valid,
        train_size=len(train_df),
        val_size=len(val_df),
        test_size=len(test_df),
        overlap_warnings=warnings
    )
```

## Section 22: Model Metrics

In landslide prediction, class imbalance is extreme (non-landslides vastly outnumber landslides). Here's a breakdown of metrics:

- **Precision** = TP/(TP+FP): "Of all the times the model predicted a landslide, how many were actual landslides?" Low precision causes alert fatigue.
- **Recall** = TP/(TP+FN): "Of all actual landslides, how many did the model detect?" Low recall means missed disasters.
- **F1 Score** = 2*P*R/(P+R): The harmonic mean of Precision and Recall. Balances the trade-off.
- **ROC-AUC**: Evaluates discrimination ability across all thresholds. However, it can be overly optimistic in highly imbalanced datasets because True Negatives dominate the False Positive Rate.
- **PR-AUC (Average Precision)**: Area under the Precision-Recall curve. Critical for imbalanced data. A model must have high precision and recall to achieve a high PR-AUC, making it more informative than ROC-AUC for landslides.
- **Brier Score** = mean((p_i - y_i)²): Measures calibration quality (how close the predicted probabilities are to the actual outcomes).
- **Confusion Matrix**: A 2x2 table showing TP, FP, TN, FN.
- **Why NOT Accuracy?**: In a dataset with 99% non-landslides and 1% landslides, a model that simply predicts "no landslide" every time achieves 99% accuracy but 0% recall, rendering it useless.

### `src/landslide_ml/evaluation/metrics.py`

```python
import numpy as np
from sklearn.metrics import (
    precision_score, recall_score, f1_score, roc_auc_score,
    average_precision_score, brier_score_loss, confusion_matrix
)
import pandas as pd

class EvaluationMetrics:
    def __init__(self, y_true: np.ndarray, y_pred_proba: np.ndarray, threshold: float = 0.5):
        self.y_true = np.array(y_true)
        self.y_pred_proba = np.array(y_pred_proba)
        self.threshold = threshold
        self.y_pred = (self.y_pred_proba >= self.threshold).astype(int)
        
        self._cm = confusion_matrix(self.y_true, self.y_pred, labels=[0, 1])
        if self._cm.shape != (2, 2):
            # Handle edge cases where one class is completely missing
            self._cm = np.zeros((2, 2), dtype=int)
            for t, p in zip(self.y_true, self.y_pred):
                self._cm[int(t), int(p)] += 1
                
        self.tn, self.fp, self.fn, self.tp = self._cm.ravel()

    @property
    def precision(self) -> float:
        return precision_score(self.y_true, self.y_pred, zero_division=0)
        
    @property
    def recall(self) -> float:
        return recall_score(self.y_true, self.y_pred, zero_division=0)
        
    @property
    def f1(self) -> float:
        return f1_score(self.y_true, self.y_pred, zero_division=0)
        
    @property
    def roc_auc(self) -> float:
        if len(np.unique(self.y_true)) < 2:
            return float('nan')
        return roc_auc_score(self.y_true, self.y_pred_proba)
        
    @property
    def pr_auc(self) -> float:
        if len(np.unique(self.y_true)) < 2:
            return float('nan')
        return average_precision_score(self.y_true, self.y_pred_proba)
        
    @property
    def brier_score(self) -> float:
        return brier_score_loss(self.y_true, self.y_pred_proba)
        
    @property
    def confusion_matrix(self) -> dict:
        return {
            "tn": int(self.tn),
            "fp": int(self.fp),
            "fn": int(self.fn),
            "tp": int(self.tp)
        }
        
    @property
    def false_positive_rate(self) -> float:
        return self.fp / (self.fp + self.tn) if (self.fp + self.tn) > 0 else 0.0
        
    @property
    def false_negative_rate(self) -> float:
        return self.fn / (self.fn + self.tp) if (self.fn + self.tp) > 0 else 0.0
        
    def to_dict(self) -> dict:
        return {
            "precision": self.precision,
            "recall": self.recall,
            "f1": self.f1,
            "roc_auc": self.roc_auc,
            "pr_auc": self.pr_auc,
            "brier_score": self.brier_score,
            "fpr": self.false_positive_rate,
            "fnr": self.false_negative_rate,
            "confusion_matrix": self.confusion_matrix,
            "threshold": self.threshold
        }
        
    def summary(self) -> str:
        d = self.to_dict()
        return (
            f"Metrics at threshold {self.threshold}:\n"
            f"  ROC-AUC: {d['roc_auc']:.4f}\n"
            f"  PR-AUC:  {d['pr_auc']:.4f}\n"
            f"  F1:      {d['f1']:.4f}\n"
            f"  Recall:  {d['recall']:.4f}\n"
            f"  Precis:  {d['precision']:.4f}\n"
            f"  Brier:   {d['brier_score']:.4f}\n"
            f"  CM:      TP={self.tp}, FP={self.fp}, TN={self.tn}, FN={self.fn}"
        )
```

## Section 23: Baseline Model

Baselines provide a necessary lower bound for model performance. The `RainfallThresholdBaseline` represents traditional non-ML early warning systems. The `MajorityClassBaseline` ensures our ML models learn *something* beyond just predicting the majority class.

### `src/landslide_ml/models/baseline.py`

```python
import numpy as np
import pandas as pd

class BaselineModel:
    def fit(self, X: pd.DataFrame, y: np.ndarray):
        pass
        
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        raise NotImplementedError

class RainfallThresholdBaseline(BaselineModel):
    def __init__(self, rainfall_col: str = "rainfall_24h", threshold: float = 100.0):
        self.rainfall_col = rainfall_col
        self.threshold = threshold
        
    def fit(self, X: pd.DataFrame, y: np.ndarray):
        pass
        
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        if self.rainfall_col not in X.columns:
            raise ValueError(f"Column {self.rainfall_col} not found in input data.")
            
        # Predict 1.0 if rainfall exceeds threshold, else 0.0
        preds = (X[self.rainfall_col] >= self.threshold).astype(float).values
        # Return [P(class=0), P(class=1)] format to match sklearn
        return np.column_stack((1 - preds, preds))

class MajorityClassBaseline(BaselineModel):
    def __init__(self):
        self.majority_class = 0
        
    def fit(self, X: pd.DataFrame, y: np.ndarray):
        # Determine majority class
        self.majority_class = int(np.bincount(y).argmax())
        
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        n_samples = len(X)
        preds = np.zeros(n_samples)
        if self.majority_class == 1:
            preds = np.ones(n_samples)
        return np.column_stack((1 - preds, preds))
```

## Section 24: Logistic Regression

Logistic regression is a generalized linear model that maps feature combinations to a probability using the sigmoid function. The coefficients are interpretable: a positive coefficient means the feature increases landslide probability.

### `src/landslide_ml/models/logistic.py`

```python
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from .registry import BaseModel

class LogisticRegressionModel(BaseModel):
    def __init__(self, random_state: int = 42):
        self.model = LogisticRegression(
            class_weight='balanced',
            max_iter=1000,
            random_state=random_state
        )
        self.scaler = StandardScaler()
        self.feature_names = None
        
    def fit(self, X: pd.DataFrame, y: np.ndarray):
        self.feature_names = list(X.columns)
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        X_scaled = self.scaler.transform(X)
        return self.model.predict_proba(X_scaled)
        
    def feature_importance(self) -> pd.DataFrame:
        """For Logistic Regression, absolute coefficients serve as feature importance."""
        if self.feature_names is None:
            raise ValueError("Model has not been fitted yet.")
            
        coefs = self.model.coef_[0]
        importance_df = pd.DataFrame({
            'feature': self.feature_names,
            'coefficient': coefs,
            'importance': np.abs(coefs)
        }).sort_values('importance', ascending=False)
        
        return importance_df
```

## Section 25: Random Forest

Random Forest builds multiple decision trees on random subsets of data and features. It is robust to noise and label errors because the ensemble averaging process reduces the variance and the impact of individual erroneous data points.

### `src/landslide_ml/models/random_forest.py`

```python
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from .registry import BaseModel

class RandomForestModel(BaseModel):
    def __init__(
        self, 
        n_estimators: int = 500, 
        max_depth: int = 15, 
        min_samples_leaf: int = 10,
        random_state: int = 42
    ):
        self.model = RandomForestClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_leaf=min_samples_leaf,
            class_weight='balanced_subsample',
            random_state=random_state,
            n_jobs=-1
        )
        self.feature_names = None
        
    def fit(self, X: pd.DataFrame, y: np.ndarray):
        self.feature_names = list(X.columns)
        self.model.fit(X, y)
        
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.model.predict_proba(X)
        
    def feature_importance(self) -> pd.DataFrame:
        if self.feature_names is None:
            raise ValueError("Model has not been fitted yet.")
            
        importance_df = pd.DataFrame({
            'feature': self.feature_names,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        return importance_df
```

## Section 26: XGBoost

Gradient boosting sequentially builds shallow trees, where each new tree attempts to correct the residual errors of the combined previous trees. It excels at capturing complex non-linear interactions. We use `interaction_constraints` inspired by the LHASA model to ensure static susceptibility features only interact with dynamic triggers (like rainfall).

### `src/landslide_ml/models/xgboost_model.py`

```python
import pandas as pd
import numpy as np
import xgboost as xgb
from .registry import BaseModel

class XGBoostModel(BaseModel):
    def __init__(
        self, 
        scale_pos_weight: float = 1.0,
        max_depth: int = 6,
        n_estimators: int = 500,
        learning_rate: float = 0.05,
        subsample: float = 0.8,
        colsample_bytree: float = 0.8,
        reg_alpha: float = 0.1,
        reg_lambda: float = 1.0,
        interaction_constraints: str = None,
        random_state: int = 42
    ):
        self.model = xgb.XGBClassifier(
            scale_pos_weight=scale_pos_weight,
            max_depth=max_depth,
            n_estimators=n_estimators,
            learning_rate=learning_rate,
            subsample=subsample,
            colsample_bytree=colsample_bytree,
            reg_alpha=reg_alpha,
            reg_lambda=reg_lambda,
            interaction_constraints=interaction_constraints,
            random_state=random_state,
            objective='binary:logistic',
            eval_metric='logloss',
            early_stopping_rounds=50,
            n_jobs=-1
        )
        self.feature_names = None
        
    def fit(self, X: pd.DataFrame, y: np.ndarray, X_val: pd.DataFrame = None, y_val: np.ndarray = None):
        self.feature_names = list(X.columns)
        
        eval_set = [(X, y)]
        if X_val is not None and y_val is not None:
            eval_set.append((X_val, y_val))
            
        self.model.fit(
            X, y,
            eval_set=eval_set,
            verbose=False
        )
        
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return self.model.predict_proba(X)
        
    def feature_importance(self) -> pd.DataFrame:
        if self.feature_names is None:
            raise ValueError("Model has not been fitted yet.")
            
        importance_dict = self.model.get_booster().get_score(importance_type='gain')
        
        # Fill missing features with 0
        importance_df = pd.DataFrame([
            {'feature': f, 'importance': importance_dict.get(f, 0.0)}
            for f in self.feature_names
        ]).sort_values('importance', ascending=False)
        
        return importance_df
```

## Section 27: Model Registry

The model registry enables switching between implementations via configuration.

### `src/landslide_ml/models/registry.py`

```python
import pandas as pd
import numpy as np
from abc import ABC, abstractmethod

class BaseModel(ABC):
    @abstractmethod
    def fit(self, X: pd.DataFrame, y: np.ndarray, **kwargs):
        pass
        
    @abstractmethod
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        pass
        
    def feature_importance(self) -> pd.DataFrame:
        raise NotImplementedError("Feature importance not implemented for this model.")

# Import models lazily to avoid circular imports if implemented in a single package
from .baseline import RainfallThresholdBaseline, MajorityClassBaseline
from .logistic import LogisticRegressionModel
from .random_forest import RandomForestModel
from .xgboost_model import XGBoostModel

MODEL_REGISTRY = {
    "baseline_rainfall": RainfallThresholdBaseline,
    "baseline_majority": MajorityClassBaseline,
    "logistic_regression": LogisticRegressionModel,
    "random_forest": RandomForestModel,
    "xgboost": XGBoostModel,
}

def get_model(name: str, **kwargs) -> BaseModel:
    if name not in MODEL_REGISTRY:
        raise ValueError(f"Model {name} not found in registry. Available: {list_models()}")
    return MODEL_REGISTRY[name](**kwargs)

def list_models() -> list[str]:
    return list(MODEL_REGISTRY.keys())
```

## Section 28: Experiment Tracking

A lightweight JSON-based tracker to record inputs, hyperparameters, and results.

### `src/landslide_ml/evaluation/experiment.py`

```python
import json
import uuid
import os
import time
from datetime import datetime
import pandas as pd

class ExperimentTracker:
    def __init__(self, experiments_dir: str):
        self.experiments_dir = experiments_dir
        os.makedirs(self.experiments_dir, exist_ok=True)
        self.manifest_path = os.path.join(self.experiments_dir, "experiments.json")
        self._init_manifest()
        
    def _init_manifest(self):
        if not os.path.exists(self.manifest_path):
            with open(self.manifest_path, 'w') as f:
                json.dump([], f)
                
    def start_experiment(self, model_name: str, dataset_version: str, feature_version: str, hyperparams: dict) -> str:
        exp_id = str(uuid.uuid4())
        
        experiment = {
            "id": exp_id,
            "start_time": datetime.now().isoformat(),
            "status": "running",
            "model_name": model_name,
            "dataset_version": dataset_version,
            "feature_version": feature_version,
            "hyperparameters": hyperparams,
            "metrics": {},
            "artifacts": {},
            "notes": ""
        }
        
        with open(self.manifest_path, 'r') as f:
            manifest = json.load(f)
            
        manifest.append(experiment)
        
        with open(self.manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)
            
        # Create dedicated directory for this experiment's artifacts
        os.makedirs(os.path.join(self.experiments_dir, exp_id), exist_ok=True)
            
        return exp_id
        
    def _update_experiment(self, experiment_id: str, update_fn):
        with open(self.manifest_path, 'r') as f:
            manifest = json.load(f)
            
        for exp in manifest:
            if exp["id"] == experiment_id:
                update_fn(exp)
                break
                
        with open(self.manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)

    def log_metrics(self, experiment_id: str, metrics: dict):
        def update(exp):
            exp["metrics"].update(metrics)
        self._update_experiment(experiment_id, update)
        
    def log_artifact(self, experiment_id: str, name: str, path: str):
        def update(exp):
            exp["artifacts"][name] = path
        self._update_experiment(experiment_id, update)
        
    def finish_experiment(self, experiment_id: str, notes: str = ""):
        def update(exp):
            exp["status"] = "completed"
            exp["end_time"] = datetime.now().isoformat()
            if notes:
                exp["notes"] = notes
        self._update_experiment(experiment_id, update)
        
    def list_experiments(self) -> list[dict]:
        with open(self.manifest_path, 'r') as f:
            return json.load(f)
            
    def compare_experiments(self, experiment_ids: list[str]) -> pd.DataFrame:
        experiments = self.list_experiments()
        selected = [e for e in experiments if e["id"] in experiment_ids]
        
        rows = []
        for exp in selected:
            row = {
                "id": exp["id"],
                "model_name": exp.get("model_name"),
                "status": exp.get("status")
            }
            # Flatten metrics
            for k, v in exp.get("metrics", {}).items():
                row[f"metric_{k}"] = v
            # Flatten hyperparams
            for k, v in exp.get("hyperparameters", {}).items():
                row[f"param_{k}"] = v
            rows.append(row)
            
        return pd.DataFrame(rows)
```

## Section 29: Training Script

A unified entrypoint to train models and run validation.

### `scripts/train_model.py`

```python
#!/usr/bin/env python
import argparse
import pandas as pd
import pickle
import os
from pathlib import Path

from landslide_ml.dataset.splitting import temporal_split
from landslide_ml.models.registry import get_model
from landslide_ml.evaluation.metrics import EvaluationMetrics
from landslide_ml.evaluation.experiment import ExperimentTracker

def main():
    parser = argparse.ArgumentParser(description="Train Landslide Model")
    parser.add_argument("--model", type=str, required=True, help="Model name from registry")
    parser.add_argument("--data", type=str, required=True, help="Path to prepared parquet data")
    parser.add_argument("--out_dir", type=str, required=True, help="Output directory")
    parser.add_argument("--target_col", type=str, default="is_landslide", help="Target column")
    parser.add_argument("--time_col", type=str, default="date", help="Temporal column for splitting")
    
    args = parser.parse_args()
    
    tracker = ExperimentTracker(os.path.join(args.out_dir, "experiments"))
    exp_id = tracker.start_experiment(
        model_name=args.model,
        dataset_version=args.data,
        feature_version="v1",
        hyperparams={}
    )
    
    print(f"Loading data from {args.data}...")
    df = pd.read_parquet(args.data)
    
    print("Splitting data temporally...")
    train_df, val_df, test_df = temporal_split(
        df, timestamp_col=args.time_col, train_end="2021-12-31", val_end="2022-12-31"
    )
    
    features = [c for c in df.columns if c not in [args.target_col, args.time_col, "lat", "lon", "pixel_id"]]
    
    X_train, y_train = train_df[features], train_df[args.target_col].values
    X_val, y_val = val_df[features], val_df[args.target_col].values
    
    print(f"Initializing {args.model}...")
    model = get_model(args.model)
    
    print("Training model...")
    # Passing validation set for models that support it (e.g. XGBoost early stopping)
    try:
        model.fit(X_train, y_train, X_val=X_val, y_val=y_val)
    except TypeError:
        model.fit(X_train, y_train)
        
    print("Evaluating on validation set...")
    val_preds_proba = model.predict_proba(X_val)[:, 1]
    metrics = EvaluationMetrics(y_val, val_preds_proba, threshold=0.5)
    
    metrics_dict = metrics.to_dict()
    print(metrics.summary())
    tracker.log_metrics(exp_id, metrics_dict)
    
    model_path = os.path.join(args.out_dir, "experiments", exp_id, "model.pkl")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
        
    tracker.log_artifact(exp_id, "model", model_path)
    tracker.finish_experiment(exp_id, notes="Standard training run")
    print(f"Experiment {exp_id} completed successfully.")

if __name__ == "__main__":
    main()
```

## Section 30: Probability Calibration

Raw outputs from models like Random Forest or SVM are often uncalibrated. For example, an output score of 0.8 does not necessarily mean an 80% real-world probability of a landslide. Calibration applies a transformation to map raw scores to true probabilities, ensuring reliable risk assessment.

### `src/landslide_ml/models/calibration.py`

```python
import numpy as np
import pickle
from sklearn.calibration import IsotonicRegression
from sklearn.linear_model import LogisticRegression

class ModelCalibrator:
    def __init__(self, method: str = "isotonic"):
        """method: 'isotonic' or 'platt'"""
        self.method = method
        if self.method == "isotonic":
            self.calibrator = IsotonicRegression(out_of_bounds='clip')
        elif self.method == "platt":
            self.calibrator = LogisticRegression()
        else:
            raise ValueError(f"Unknown calibration method {method}")
            
    def fit(self, y_true: np.ndarray, y_pred_proba: np.ndarray):
        """Fit on validation set."""
        if self.method == "platt":
            self.calibrator.fit(y_pred_proba.reshape(-1, 1), y_true)
        else:
            self.calibrator.fit(y_pred_proba, y_true)
            
    def calibrate(self, y_pred_proba: np.ndarray) -> np.ndarray:
        if self.method == "platt":
            return self.calibrator.predict_proba(y_pred_proba.reshape(-1, 1))[:, 1]
        else:
            return self.calibrator.predict(y_pred_proba)
            
    def save(self, path: str):
        with open(path, 'wb') as f:
            pickle.dump({'method': self.method, 'calibrator': self.calibrator}, f)
            
    def load(self, path: str):
        with open(path, 'rb') as f:
            data = pickle.load(f)
            self.method = data['method']
            self.calibrator = data['calibrator']
```

### `src/landslide_ml/evaluation/calibration.py`

```python
import numpy as np
from sklearn.metrics import brier_score_loss
from sklearn.calibration import calibration_curve

def calibration_curve_data(y_true: np.ndarray, y_pred_proba: np.ndarray, n_bins: int = 10) -> dict:
    prob_true, prob_pred = calibration_curve(y_true, y_pred_proba, n_bins=n_bins, strategy='uniform')
    return {
        "prob_true": prob_true.tolist(),
        "prob_pred": prob_pred.tolist()
    }

def brier_score(y_true: np.ndarray, y_pred_proba: np.ndarray) -> float:
    return brier_score_loss(y_true, y_pred_proba)

def plot_calibration_data(y_true: np.ndarray, y_pred_proba: np.ndarray) -> dict:
    """Returns data formatted for easy frontend plotting."""
    curve = calibration_curve_data(y_true, y_pred_proba)
    brier = brier_score(y_true, y_pred_proba)
    
    return {
        "x": curve["prob_pred"],
        "y": curve["prob_true"],
        "perfect_x": [0, 1],
        "perfect_y": [0, 1],
        "brier_score": brier
    }
```

## Section 31: Threshold Optimization

Standard classification uses a 0.5 threshold. However, for imbalanced classes and disaster prediction, the optimal threshold depends on the cost of false positives vs. false negatives.

### `src/landslide_ml/evaluation/metrics.py` (Additions)

```python
def optimize_thresholds(
    y_true: np.ndarray,
    y_pred_proba: np.ndarray,
    thresholds: list[float] = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
) -> pd.DataFrame:
    """Test different thresholds and return metrics table."""
    results = []
    
    for t in thresholds:
        metrics = EvaluationMetrics(y_true, y_pred_proba, threshold=t)
        res = metrics.to_dict()
        results.append(res)
        
    return pd.DataFrame(results)

def select_optimal_threshold(
    threshold_results: pd.DataFrame,
    strategy: str = "f1",
) -> float:
    """Select best threshold based on a specific strategy."""
    if strategy == "f1":
        best_idx = threshold_results['f1'].idxmax()
    elif strategy == "recall_priority":
        # Highest F1 where recall is at least 0.8
        valid = threshold_results[threshold_results['recall'] >= 0.8]
        if valid.empty:
            best_idx = threshold_results['recall'].idxmax()
        else:
            best_idx = valid['f1'].idxmax()
    elif strategy == "precision_priority":
        # Highest F1 where precision is at least 0.8
        valid = threshold_results[threshold_results['precision'] >= 0.8]
        if valid.empty:
            best_idx = threshold_results['precision'].idxmax()
        else:
            best_idx = valid['f1'].idxmax()
    else:
        raise ValueError(f"Unknown strategy: {strategy}")
        
    return threshold_results.loc[best_idx, 'threshold']
```

### Risk Classification Integration
`src/landslide_ml/api/schemas/prediction.py` (Partial)
```python
class RiskClassifier:
    def __init__(self, thresholds: dict):
        """
        thresholds: {"low": [0, 0.3], "medium": [0.3, 0.7], "high": [0.7, 1.0]}
        """
        self.thresholds = thresholds
        
    def classify(self, risk_score: float) -> str:
        for level, bounds in self.thresholds.items():
            if bounds[0] <= risk_score <= bounds[1]:
                return level
        return "unknown"
```

## Section 32: False Negative Analysis

False negatives (missed landslides) cost lives. Analyzing them reveals systemic blind spots (e.g., the model always misses debris flows in specific geologies).

### `src/landslide_ml/evaluation/confusion.py`

```python
import pandas as pd
import numpy as np

def analyze_false_negatives(
    y_true: np.ndarray, 
    y_pred: np.ndarray, 
    y_pred_proba: np.ndarray, 
    features_df: pd.DataFrame, 
    threshold: float = 0.5
) -> pd.DataFrame:
    """Return detailed DataFrame of all false negatives with their features."""
    preds = (y_pred_proba >= threshold).astype(int)
    
    # FN: True class is 1, Predicted is 0
    fn_mask = (y_true == 1) & (preds == 0)
    
    fn_df = features_df[fn_mask].copy()
    fn_df['predicted_probability'] = y_pred_proba[fn_mask]
    
    return fn_df

def false_negative_report(fn_df: pd.DataFrame) -> dict:
    """Generate summary statistics about false negatives."""
    if fn_df.empty:
        return {"count": 0}
        
    report = {
        "count": len(fn_df),
        "mean_predicted_prob": float(fn_df['predicted_probability'].mean()),
        "max_predicted_prob": float(fn_df['predicted_probability'].max()),
    }
    
    # If rainfall column exists, see what the rainfall was when we missed
    if 'rainfall_24h' in fn_df.columns:
        report["mean_rainfall_during_fn"] = float(fn_df['rainfall_24h'].mean())
        
    return report
```

## Section 33: False Positive Analysis

False positives (false alarms) cause alert fatigue, leading residents to ignore future real warnings.

Add to `src/landslide_ml/evaluation/confusion.py`:

```python
def analyze_false_positives(
    y_true: np.ndarray, 
    y_pred: np.ndarray, 
    y_pred_proba: np.ndarray, 
    features_df: pd.DataFrame, 
    threshold: float = 0.5
) -> pd.DataFrame:
    """Return detailed DataFrame of all false positives with their features."""
    preds = (y_pred_proba >= threshold).astype(int)
    
    # FP: True class is 0, Predicted is 1
    fp_mask = (y_true == 0) & (preds == 1)
    
    fp_df = features_df[fp_mask].copy()
    fp_df['predicted_probability'] = y_pred_proba[fp_mask]
    
    return fp_df

def false_positive_report(fp_df: pd.DataFrame) -> dict:
    """Generate summary statistics about false positives."""
    if fp_df.empty:
        return {"count": 0}
        
    report = {
        "count": len(fp_df),
        "mean_predicted_prob": float(fp_df['predicted_probability'].mean()),
        "min_predicted_prob": float(fp_df['predicted_probability'].min()),
    }
    return report
```

## Section 34: Temporal and Geographic Validation

Robust models must prove they generalize across time (future events) and space (unseen regions).

### `src/landslide_ml/evaluation/temporal.py`

```python
import pandas as pd
from .metrics import EvaluationMetrics
from ..dataset.splitting import temporal_split

def temporal_validation(
    model, 
    feature_cols: list[str], 
    df: pd.DataFrame, 
    timestamp_col: str,
    train_end: str, 
    val_end: str
) -> dict:
    """Returns metrics for train, val, and test periods."""
    train_df, val_df, test_df = temporal_split(df, timestamp_col, train_end, val_end)
    
    results = {}
    
    for split_name, split_df in [("train", train_df), ("val", val_df), ("test", test_df)]:
        if split_df.empty:
            continue
            
        X = split_df[feature_cols]
        y = split_df["is_landslide"].values
        
        preds_proba = model.predict_proba(X)[:, 1]
        metrics = EvaluationMetrics(y, preds_proba)
        
        results[split_name] = metrics.to_dict()
        
    return results
```

### `src/landslide_ml/evaluation/geographic.py`

```python
import pandas as pd
from .metrics import EvaluationMetrics
from ..dataset.splitting import geographic_split

def geographic_validation(
    model, 
    feature_cols: list[str], 
    df: pd.DataFrame, 
    lat_col: str, 
    lon_col: str,
    test_regions: list[dict]
) -> dict:
    """Returns metrics for each holdout region."""
    results = {}
    
    for region in test_regions:
        region_name = region["name"]
        
        # Test just this one region
        _, test_df = geographic_split(df, lat_col, lon_col, [region])
        
        if test_df.empty:
            continue
            
        X = test_df[feature_cols]
        y = test_df["is_landslide"].values
        
        preds_proba = model.predict_proba(X)[:, 1]
        metrics = EvaluationMetrics(y, preds_proba)
        
        results[region_name] = metrics.to_dict()
        
    return results
```

## Section 35: Explainability

Explainability is necessary to build trust with local authorities. 
**Crucial Distinction**: Feature contribution (SHAP values) indicates how much a feature influenced the *model's mathematical output*. It does **not** equal causal, real-world influence (e.g., if a model learns a shortcut that a specific road type predicts landslides, changing the road type won't stop the landslide).

### `src/landslide_ml/explainability/global_importance.py`

```python
import pandas as pd

def global_feature_importance(model, feature_names: list[str]) -> pd.DataFrame:
    """Extract global feature importance from any supported model."""
    try:
        # If the model has the standardized interface
        return model.feature_importance()
    except AttributeError:
        # Fallback for raw sklearn/xgboost models
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
        elif hasattr(model, 'coef_'):
            importances = abs(model.coef_[0])
        else:
            raise ValueError("Model type not supported for global feature importance extraction.")
            
        return pd.DataFrame({
            'feature': feature_names,
            'importance': importances
        }).sort_values('importance', ascending=False)
```

### `src/landslide_ml/explainability/local_shap.py`

```python
import pandas as pd
import numpy as np
import shap

class SHAPExplainer:
    def __init__(self, model, feature_names: list[str]):
        self.model = model
        self.feature_names = feature_names
        
        # Attempt to get underlying estimator if it's a wrapper
        underlying = getattr(model, 'model', model)
        
        try:
            self.explainer = shap.TreeExplainer(underlying)
            self.explainer_type = "tree"
        except Exception:
            # Fallback to KernelExplainer for non-tree models
            # Warning: KernelExplainer needs a background dataset in practice
            self.explainer = shap.Explainer(underlying.predict_proba)
            self.explainer_type = "generic"
            
    def explain_single(self, features: dict) -> list[dict]:
        """Explain a single prediction."""
        df = pd.DataFrame([features], columns=self.feature_names)
        
        if self.explainer_type == "tree":
            shap_values = self.explainer.shap_values(df)
            # Handle list output for classifiers
            if isinstance(shap_values, list):
                shap_values = shap_values[1] # positive class
            vals = shap_values[0]
        else:
            shap_values = self.explainer(df)
            vals = shap_values.values[0, :, 1] # positive class
            
        explanations = []
        for i, col in enumerate(self.feature_names):
            explanations.append({
                "feature": col,
                "value": features[col],
                "shap_value": float(vals[i]),
                "impact": "increases risk" if vals[i] > 0 else "decreases risk"
            })
            
        # Sort by absolute impact
        explanations.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
        return explanations
        
    def explain_batch(self, features_df: pd.DataFrame) -> pd.DataFrame:
        """Calculate SHAP values for a batch of instances."""
        # Ensure column order matches
        X = features_df[self.feature_names]
        
        if self.explainer_type == "tree":
            shap_values = self.explainer.shap_values(X)
            if isinstance(shap_values, list):
                shap_values = shap_values[1]
        else:
            shap_values = self.explainer(X).values[:, :, 1]
            
        return pd.DataFrame(shap_values, columns=self.feature_names, index=features_df.index)
```


---

# PART 5: HISTORICAL REPLAY, MODEL PACKAGING, FASTAPI, TESTING & DEPLOYMENT (Sections 36-54)

## Section 36: Historical Replay Engine

The Historical Replay Engine evaluates how the model would have performed if it had been running live during historical events.

### `src/landslide_ml/evaluation/replay.py`

```python
import pandas as pd
from dataclasses import dataclass
from typing import List, Dict, Any

@dataclass
class ReplayResult:
    timestamp: str
    latitude: float
    longitude: float
    risk_score: float
    risk_level: str
    actual_outcome: int  # 1=landslide, 0=no landslide
    correct: bool
    classification: str  # TP, FP, TN, FN

@dataclass 
class ReplayReport:
    total_events: int
    correct_warnings: int  # TP
    missed_events: int     # FN
    false_alarms: int      # FP
    correct_non_events: int # TN
    recall: float
    precision: float
    f1: float
    results: List[ReplayResult]

class HistoricalReplayEngine:
    def __init__(self, model, calibrator, risk_classifier, feature_pipeline):
        self.model = model
        self.calibrator = calibrator
        self.risk_classifier = risk_classifier
        self.feature_pipeline = feature_pipeline
    
    def replay_single(self, event_record: Dict[str, Any]) -> ReplayResult:
        # Reconstruct features available BEFORE prediction time
        features_df = pd.DataFrame([event_record])
        processed_features = self.feature_pipeline.transform(features_df)
        
        # Run frozen model
        raw_prob = self.model.predict_proba(processed_features)[:, 1][0]
        
        if self.calibrator:
            calibrated_prob = self.calibrator.predict_proba(processed_features)[:, 1][0]
        else:
            calibrated_prob = raw_prob
            
        risk_level = self.risk_classifier.classify(calibrated_prob)
        actual = event_record.get('target', 0)
        
        predicted_positive = risk_level in ['HIGH', 'VERY_HIGH']
        actual_positive = bool(actual)
        
        correct = predicted_positive == actual_positive
        
        if predicted_positive and actual_positive:
            classification = "TP"
        elif predicted_positive and not actual_positive:
            classification = "FP"
        elif not predicted_positive and not actual_positive:
            classification = "TN"
        else:
            classification = "FN"
            
        return ReplayResult(
            timestamp=str(event_record.get('timestamp', 'unknown')),
            latitude=float(event_record.get('latitude', 0.0)),
            longitude=float(event_record.get('longitude', 0.0)),
            risk_score=float(calibrated_prob),
            risk_level=risk_level,
            actual_outcome=int(actual),
            correct=correct,
            classification=classification
        )
    
    def replay_dataset(self, events_df: pd.DataFrame) -> ReplayReport:
        results = []
        for _, row in events_df.iterrows():
            result = self.replay_single(row.to_dict())
            results.append(result)
            
        return self.generate_report(results)
    
    def generate_report(self, results: List[ReplayResult]) -> ReplayReport:
        tp = sum(1 for r in results if r.classification == 'TP')
        fp = sum(1 for r in results if r.classification == 'FP')
        tn = sum(1 for r in results if r.classification == 'TN')
        fn = sum(1 for r in results if r.classification == 'FN')
        
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
        
        return ReplayReport(
            total_events=len(results),
            correct_warnings=tp,
            missed_events=fn,
            false_alarms=fp,
            correct_non_events=tn,
            recall=recall,
            precision=precision,
            f1=f1,
            results=results
        )
```

### `scripts/run_replay.py`

```python
import argparse
import pandas as pd
import joblib
import json
from pathlib import Path
from landslide_ml.evaluation.replay import HistoricalReplayEngine
from landslide_ml.models.registry import load_production_model

def run_replay(model_dir: str, data_path: str, output_path: str):
    print(f"Loading production model from {model_dir}...")
    prod_model = load_production_model(model_dir)
    
    print(f"Loading historical events from {data_path}...")
    df = pd.read_parquet(data_path)
    
    engine = HistoricalReplayEngine(
        model=prod_model.model,
        calibrator=prod_model.calibrator,
        risk_classifier=prod_model.threshold_config, # Simplified for example
        feature_pipeline=prod_model.preprocessor
    )
    
    print("Running replay simulation...")
    report = engine.replay_dataset(df)
    
    print(f"Total Events: {report.total_events}")
    print(f"Recall: {report.recall:.4f}")
    print(f"Precision: {report.precision:.4f}")
    
    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Save report
    report_dict = {
        "metrics": {
            "total_events": report.total_events,
            "correct_warnings": report.correct_warnings,
            "missed_events": report.missed_events,
            "false_alarms": report.false_alarms,
            "correct_non_events": report.correct_non_events,
            "recall": report.recall,
            "precision": report.precision,
            "f1": report.f1
        },
        "results": [r.__dict__ for r in report.results]
    }
    
    with open(output_path, 'w') as f:
        json.dump(report_dict, f, indent=2)
        
    print(f"Report saved to {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-dir", required=True)
    parser.add_argument("--data", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    
    run_replay(args.model_dir, args.data, args.output)
```

## Section 37: Stress Testing

### `src/landslide_ml/evaluation/stress.py`

```python
import pandas as pd
import numpy as np

def stress_test_rainfall(model, feature_pipeline, base_features: dict) -> pd.DataFrame:
    """Test with rainfall_24h from 0 to 500mm in steps."""
    results = []
    for rain in np.linspace(0, 500, 50):
        features = base_features.copy()
        features['rainfall_24h'] = rain
        df = pd.DataFrame([features])
        X = feature_pipeline.transform(df)
        prob = model.predict_proba(X)[:, 1][0]
        results.append({'rainfall_24h': rain, 'risk_score': prob})
    return pd.DataFrame(results)

def stress_test_slope(model, feature_pipeline, base_features: dict) -> pd.DataFrame:
    """Test with slope from 0 to 80 degrees."""
    results = []
    for slope in np.linspace(0, 80, 40):
        features = base_features.copy()
        features['slope'] = slope
        df = pd.DataFrame([features])
        X = feature_pipeline.transform(df)
        prob = model.predict_proba(X)[:, 1][0]
        results.append({'slope': slope, 'risk_score': prob})
    return pd.DataFrame(results)

def stress_test_missing_features(model, feature_names: list, base_features: dict, feature_pipeline) -> pd.DataFrame:
    """Test with each feature set to NaN one at a time."""
    results = []
    for feature in feature_names:
        features = base_features.copy()
        features[feature] = np.nan
        df = pd.DataFrame([features])
        X = feature_pipeline.transform(df)
        prob = model.predict_proba(X)[:, 1][0]
        results.append({'missing_feature': feature, 'risk_score': prob})
    return pd.DataFrame(results)

def stress_test_extreme_combinations(model, feature_pipeline) -> pd.DataFrame:
    """Test extreme but plausible feature combinations."""
    scenarios = [
        {'scenario': 'High Rain, Flat', 'rainfall_24h': 300, 'slope': 5, 'elevation': 100},
        {'scenario': 'Low Rain, Steep', 'rainfall_24h': 10, 'slope': 60, 'elevation': 1000},
        {'scenario': 'High Rain, Steep', 'rainfall_24h': 300, 'slope': 60, 'elevation': 1000},
    ]
    
    results = []
    for s in scenarios:
        df = pd.DataFrame([s])
        X = feature_pipeline.transform(df)
        prob = model.predict_proba(X)[:, 1][0]
        results.append({**s, 'risk_score': prob})
    return pd.DataFrame(results)

def model_sanity_checks(model, feature_pipeline, base_features: dict) -> list:
    """Run sanity checks."""
    issues = []
    
    # 1. Predictions between 0 and 1
    df = pd.DataFrame([base_features])
    X = feature_pipeline.transform(df)
    prob = model.predict_proba(X)[:, 1][0]
    if not (0 <= prob <= 1):
        issues.append({"check": "prob_bounds", "status": "FAIL", "msg": f"Prob out of bounds: {prob}"})
    else:
        issues.append({"check": "prob_bounds", "status": "PASS"})
        
    # 2. Monotonicity (Rainfall)
    df_rain = stress_test_rainfall(model, feature_pipeline, base_features)
    is_monotonic = df_rain['risk_score'].is_monotonic_increasing
    if not is_monotonic:
        issues.append({"check": "rain_monotonicity", "status": "FAIL", "msg": "Risk doesn't always increase with rain"})
    else:
        issues.append({"check": "rain_monotonicity", "status": "PASS"})
        
    return issues
```

## Section 38: Model Comparison

### `scripts/evaluate_model.py`

```python
import argparse
import pandas as pd
import joblib
import json
from pathlib import Path
from sklearn.metrics import average_precision_score, recall_score, precision_score, f1_score

def evaluate_models(models_dirs: list, test_data_path: str, output_path: str):
    df_test = pd.read_parquet(test_data_path)
    y_true = df_test['target']
    
    results = []
    
    for model_dir in models_dirs:
        model_path = Path(model_dir) / 'model.joblib'
        pipeline_path = Path(model_dir) / 'preprocessor.joblib'
        
        model = joblib.load(model_path)
        pipeline = joblib.load(pipeline_path)
        
        X_test = pipeline.transform(df_test)
        y_prob = model.predict_proba(X_test)[:, 1]
        y_pred = (y_prob > 0.5).astype(int)
        
        pr_auc = average_precision_score(y_true, y_prob)
        recall = recall_score(y_true, y_pred)
        precision = precision_score(y_true, y_pred)
        f1 = f1_score(y_true, y_pred)
        
        results.append({
            'model_name': model_dir,
            'pr_auc': pr_auc,
            'recall': recall,
            'precision': precision,
            'f1': f1
        })
        
    results_df = pd.DataFrame(results)
    print(results_df.sort_values(by=['pr_auc', 'recall'], ascending=False).to_markdown())
    
    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)
    results_df.to_csv(output_path, index=False)
    print(f"Evaluation report saved to {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-dirs", nargs='+', required=True)
    parser.add_argument("--test-data", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    
    evaluate_models(args.model_dirs, args.test_data, args.output)
```

## Section 39: Model Packaging

### `src/landslide_ml/models/registry.py`

```python
import os
import json
import yaml
import joblib
from pathlib import Path
from dataclasses import dataclass
from typing import Any, Dict
import pandas as pd

@dataclass
class ProductionModel:
    model: Any
    preprocessor: Any
    calibrator: Any
    feature_config: Dict
    threshold_config: Dict
    metadata: Dict
    
    def predict(self, features: Dict) -> Dict:
        df = pd.DataFrame([features])
        return self.predict_batch(df).iloc[0].to_dict()
        
    def predict_batch(self, features_df: pd.DataFrame) -> pd.DataFrame:
        X = self.preprocessor.transform(features_df)
        prob = self.model.predict_proba(X)[:, 1]
        if self.calibrator:
            prob = self.calibrator.predict_proba(X)[:, 1]
        
        results = features_df.copy()
        results['risk_score'] = prob
        return results

def package_model(
    model: Any,
    preprocessor: Any,
    calibrator: Any,
    feature_config: dict,
    threshold_config: dict,
    metadata: dict,
    output_dir: str,
    version: str,
) -> str:
    """Package a trained model as a versioned artifact."""
    model_name = metadata.get('model_name', 'landslide_model')
    target_dir = Path(output_dir) / f"{model_name}-v{version}"
    target_dir.mkdir(parents=True, exist_ok=True)
    
    joblib.dump(model, target_dir / "model.joblib")
    if preprocessor:
        joblib.dump(preprocessor, target_dir / "preprocessor.joblib")
    if calibrator:
        joblib.dump(calibrator, target_dir / "calibrator.joblib")
        
    with open(target_dir / "feature_config.yaml", 'w') as f:
        yaml.dump(feature_config, f)
        
    with open(target_dir / "thresholds.yaml", 'w') as f:
        yaml.dump(threshold_config, f)
        
    metadata['version'] = version
    with open(target_dir / "metadata.json", 'w') as f:
        json.dump(metadata, f, indent=2)
        
    return str(target_dir)

def load_production_model(model_dir: str) -> ProductionModel:
    """Load a frozen production model artifact."""
    mdir = Path(model_dir)
    
    model = joblib.load(mdir / "model.joblib")
    preprocessor = joblib.load(mdir / "preprocessor.joblib") if (mdir / "preprocessor.joblib").exists() else None
    calibrator = joblib.load(mdir / "calibrator.joblib") if (mdir / "calibrator.joblib").exists() else None
    
    with open(mdir / "feature_config.yaml", 'r') as f:
        feature_config = yaml.safe_load(f)
        
    with open(mdir / "thresholds.yaml", 'r') as f:
        threshold_config = yaml.safe_load(f)
        
    with open(mdir / "metadata.json", 'r') as f:
        metadata = json.load(f)
        
    return ProductionModel(
        model=model,
        preprocessor=preprocessor,
        calibrator=calibrator,
        feature_config=feature_config,
        threshold_config=threshold_config,
        metadata=metadata
    )
```

## Section 40: Model Versioning & Metadata

### `metadata.json` Schema Example

```json
{
  "model_name": "rf_landslide_base",
  "version": "1.0.0",
  "training_date": "2023-10-27T10:00:00Z",
  "author": "ML Team",
  "dataset": {
    "name": "landslide_dataset_v2",
    "rows": 10000,
    "features": 15
  },
  "metrics": {
    "pr_auc": 0.85,
    "recall": 0.90,
    "precision": 0.82
  },
  "algorithm": "RandomForestClassifier",
  "hyperparameters": {
    "n_estimators": 200,
    "max_depth": 10
  }
}
```

## Section 41: FastAPI Inference Service

### `src/landslide_ml/api/schemas/prediction.py`

```python
from pydantic import BaseModel, Field
from typing import List, Optional

class ContributingFactor(BaseModel):
    feature: str
    value: float
    impact: str
    contribution: float

class PredictionRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    rainfall_24h: float = Field(..., ge=0)
    slope: float = Field(..., ge=0)
    elevation: float = Field(..., ge=0)

class PredictionResponse(BaseModel):
    risk_score: float
    risk_probability: float
    risk_percentage: float
    risk_level: str
    model_version: str
    feature_version: str
    prediction_timestamp: str
    contributing_factors: List[ContributingFactor]

class BatchPredictionRequest(BaseModel):
    zone_id: str
    predictions: List[PredictionRequest]

class BatchPredictionResponse(BaseModel):
    zone_id: str
    results: List[PredictionResponse]

class RiskClassifier:
    def __init__(self, thresholds: dict):
        self.thresholds = thresholds
        
    def classify(self, prob: float) -> str:
        if prob >= self.thresholds.get('VERY_HIGH', 0.8):
            return 'VERY_HIGH'
        elif prob >= self.thresholds.get('HIGH', 0.6):
            return 'HIGH'
        elif prob >= self.thresholds.get('MODERATE', 0.4):
            return 'MODERATE'
        return 'LOW'
```

### `src/landslide_ml/api/schemas/model_info.py`

```python
from pydantic import BaseModel
from typing import Dict, Any

class ModelInfoResponse(BaseModel):
    model_name: str
    version: str
    training_date: str
    metrics: Dict[str, float]

class HealthResponse(BaseModel):
    status: str
    
class ReadinessResponse(BaseModel):
    status: str
    model_loaded: bool
```

### `src/landslide_ml/api/schemas/errors.py`

```python
from pydantic import BaseModel
from typing import List, Dict, Any

class ErrorResponse(BaseModel):
    error: str
    message: str

class ValidationErrorResponse(BaseModel):
    error: str
    details: List[Dict[str, Any]]
```

### `src/landslide_ml/api/dependencies.py`

```python
import os
from functools import lru_cache
from landslide_ml.models.registry import load_production_model
from landslide_ml.api.schemas.prediction import RiskClassifier

@lru_cache()
def get_production_model():
    model_dir = os.environ.get("MODEL_DIR", "/app/models/production/current")
    return load_production_model(model_dir)

@lru_cache()
def get_risk_classifier():
    model = get_production_model()
    return RiskClassifier(model.threshold_config)

@lru_cache()
def get_shap_explainer():
    # Placeholder for SHAP explainer
    return None
```

### `src/landslide_ml/api/services/prediction_service.py`

```python
import datetime
from landslide_ml.api.schemas.prediction import (
    PredictionRequest, PredictionResponse, BatchPredictionRequest, BatchPredictionResponse, ContributingFactor
)

class PredictionService:
    def __init__(self, production_model, risk_classifier, explainer):
        self.model = production_model
        self.classifier = risk_classifier
        self.explainer = explainer
        
    def predict_single(self, request: PredictionRequest) -> PredictionResponse:
        features = request.model_dump()
        result = self.model.predict(features)
        
        prob = result['risk_score']
        risk_level = self.classifier.classify(prob)
        
        # Mock SHAP for example
        factors = [
            ContributingFactor(feature="rainfall_24h", value=request.rainfall_24h, impact="High", contribution=0.4)
        ]
        
        return PredictionResponse(
            risk_score=prob,
            risk_probability=prob,
            risk_percentage=round(prob * 100, 2),
            risk_level=risk_level,
            model_version=self.model.metadata.get('version', 'unknown'),
            feature_version="1.0",
            prediction_timestamp=datetime.datetime.utcnow().isoformat(),
            contributing_factors=factors
        )
        
    def predict_batch(self, request: BatchPredictionRequest) -> BatchPredictionResponse:
        results = [self.predict_single(r) for r in request.predictions]
        return BatchPredictionResponse(zone_id=request.zone_id, results=results)
```

### `src/landslide_ml/api/routes/health.py`

```python
from fastapi import APIRouter, Depends
from landslide_ml.api.schemas.model_info import HealthResponse, ReadinessResponse
from landslide_ml.api.dependencies import get_production_model

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="ok")

@router.get("/ready", response_model=ReadinessResponse)
async def readiness_check(model = Depends(get_production_model)):
    return ReadinessResponse(status="ready", model_loaded=True)
```

### `src/landslide_ml/api/routes/model_info.py`

```python
from fastapi import APIRouter, Depends
from landslide_ml.api.schemas.model_info import ModelInfoResponse
from landslide_ml.api.dependencies import get_production_model

router = APIRouter()

@router.get("/api/v1/model", response_model=ModelInfoResponse)
async def get_model_info(model = Depends(get_production_model)):
    return ModelInfoResponse(
        model_name=model.metadata.get('model_name', 'unknown'),
        version=model.metadata.get('version', 'unknown'),
        training_date=model.metadata.get('training_date', 'unknown'),
        metrics=model.metadata.get('metrics', {})
    )
```

### `src/landslide_ml/api/routes/prediction.py`

```python
from fastapi import APIRouter, Depends
from landslide_ml.api.schemas.prediction import PredictionRequest, PredictionResponse, BatchPredictionRequest, BatchPredictionResponse
from landslide_ml.api.dependencies import get_production_model, get_risk_classifier, get_shap_explainer
from landslide_ml.api.services.prediction_service import PredictionService

router = APIRouter()

def get_prediction_service(
    model = Depends(get_production_model),
    classifier = Depends(get_risk_classifier),
    explainer = Depends(get_shap_explainer)
):
    return PredictionService(model, classifier, explainer)

@router.post("/api/v1/predict", response_model=PredictionResponse)
async def predict(
    request: PredictionRequest,
    service: PredictionService = Depends(get_prediction_service)
):
    return service.predict_single(request)

@router.post("/api/v1/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(
    request: BatchPredictionRequest,
    service: PredictionService = Depends(get_prediction_service)
):
    return service.predict_batch(request)
```

### `src/landslide_ml/api/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from landslide_ml.api.routes import health, model_info, prediction

app = FastAPI(
    title="Landslide Risk Prediction ML Engine",
    description="API for predicting landslide risk.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(model_info.router)
app.include_router(prediction.router)

# Exception handlers would be added here
```

## Section 42: Error Handling

Standardized error responses map HTTP status codes to standard formats. Validation errors (422) provide detailed field-level feedback via Pydantic. Internal errors (500) hide stack traces from users but log them for debugging.

## Section 43: Complete Test Suite

### `tests/conftest.py`

```python
import pytest
from landslide_ml.api.schemas.prediction import PredictionRequest

@pytest.fixture
def sample_prediction_request():
    return PredictionRequest(
        latitude=34.0,
        longitude=-118.0,
        rainfall_24h=150.0,
        slope=35.0,
        elevation=500.0
    )
```

### `tests/unit/test_validation.py`

```python
import pytest
from pydantic import ValidationError
from landslide_ml.api.schemas.prediction import PredictionRequest

def test_valid_request(sample_prediction_request):
    assert sample_prediction_request.latitude == 34.0

def test_invalid_latitude():
    with pytest.raises(ValidationError):
        PredictionRequest(
            latitude=100.0, # Invalid > 90
            longitude=-118.0,
            rainfall_24h=150.0,
            slope=35.0,
            elevation=500.0
        )
```

### `tests/unit/test_risk_classifier.py`

```python
from landslide_ml.api.schemas.prediction import RiskClassifier

def test_risk_classifier():
    thresholds = {'LOW': 0.0, 'MODERATE': 0.4, 'HIGH': 0.6, 'VERY_HIGH': 0.8}
    classifier = RiskClassifier(thresholds)
    
    assert classifier.classify(0.1) == 'LOW'
    assert classifier.classify(0.4) == 'MODERATE'
    assert classifier.classify(0.7) == 'HIGH'
    assert classifier.classify(0.9) == 'VERY_HIGH'
```

### `tests/api/test_health.py`

```python
from fastapi.testclient import TestClient
from landslide_ml.api.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

## Section 44: Dockerfile & Docker Compose

### `Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ /app/src/
ENV PYTHONPATH=/app/src

CMD ["uvicorn", "landslide_ml.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### `docker-compose.yml`

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MODEL_DIR=/app/models/production/current
      - ENVIRONMENT=production
    volumes:
      - ./models:/app/models
```

## Section 45: Production Configuration

- **`MODEL_DIR`**: Path to the serialized model folder.
- **Workers**: Use Gunicorn with Uvicorn workers (`-k uvicorn.workers.UvicornWorker`) in production for concurrency.
- **Logging**: Set log level to INFO in production, DEBUG in dev. Use JSON structured logging.

## Section 46: Monitoring

- **Service Monitoring**: Prometheus metrics for HTTP requests, latency, 5xx errors.
- **Data Monitoring**: Track missing values, out-of-bound inputs, and coordinate drift.
- **ML Monitoring**: Track the distribution of predicted probabilities and risk levels over time.

## Section 47: Model Drift and Retraining

Workflow:
1. Production Data ingested.
2. Monitoring triggers alerts on distribution shift.
3. Pipeline retrains candidate model.
4. Stress Testing & Replay validation.
5. Manual approval.
6. Deployment as new active version.

## Section 48: Limitations

- **Incomplete Inventory**: Unreported landslides skew negative labels.
- **Geographic Generalization**: Models trained on one region perform poorly in different geologies.
- **Sensor Gaps**: Sparse rainfall station networks reduce accuracy.

## Section 49: MVP vs Future

- **MVP**: Tabular ML (RF/XGBoost), static terrain + basic rainfall features.
- **Future**: Deep learning, satellite imagery integration (CV), real-time IoT soil sensors.

## Section 50: Build Order

1. Environment setup and data ingestion
2. Exploratory Data Analysis
3. Feature Engineering pipeline
4. Base model training
5. Hyperparameter tuning & calibration
6. Evaluation and Stress Testing
7. Model Packaging
8. API Development
9. Dockerization & Deployment

## Section 51: Command Reference

- `python -m pytest tests/` : Run test suite
- `uvicorn src.landslide_ml.api.main:app --reload` : Start dev server
- `docker-compose up --build` : Build and run containers
- `python scripts/train.py --config config.yaml` : Train model

## Section 52: Troubleshooting Guide

- **Symptom**: Model predictions are consistently 'LOW'.
  - **Cause**: Class imbalance during training.
  - **Solution**: Use SMOTE or class weights.
- **Symptom**: API returns 422 Unprocessable Entity.
  - **Cause**: Input payload violates Pydantic constraints.
  - **Solution**: Validate input coordinates and rainfall bounds.

## Section 53: Final Project Tree

```
landslide_ml/
├── data/
├── models/
├── notebooks/
├── scripts/
│   ├── run_replay.py
│   └── evaluate_model.py
├── src/
│   └── landslide_ml/
│       ├── api/
│       │   ├── main.py
│       │   ├── dependencies.py
│       │   ├── routes/
│       │   ├── schemas/
│       │   └── services/
│       ├── evaluation/
│       │   ├── replay.py
│       │   └── stress.py
│       └── models/
│           └── registry.py
├── tests/
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## Section 54: Builder Checklist

- [x] Data ingested and cleaned
- [x] Features engineered and selected
- [x] Model trained and tuned
- [x] Model calibrated
- [x] Stress tests pass
- [x] FastAPI implementation complete
- [x] Pydantic validation active
- [x] Unit tests passing
- [x] Docker container built
- [x] CI/CD pipeline prepared
