# Product Requirements Document — AI Landslide Risk Prediction ML Engine

**Product:** AI-Based Early Warning and Landslide Risk Monitoring System — ML Risk Prediction Engine  
**Version:** 1.0.0  
**Date:** 26 August 2026  
**Status:** Draft  
**Target Region:** North Eastern Region (NER) of India  

---

## Table of Contents

1. [Product Context](#1-product-context)
2. [Product Vision](#2-product-vision)
3. [Product Goals](#3-product-goals)
4. [Explicit Non-Goals](#4-explicit-non-goals)
5. [Recommended Technology Stack](#5-recommended-technology-stack)
6. [Data Strategy](#6-data-strategy)
7. [Training Dataset Design](#7-training-dataset-design)
8. [Feature Engineering](#8-feature-engineering)
9. [Data Leakage Prevention](#9-data-leakage-prevention)
10. [Model Development Strategy](#10-model-development-strategy)
11. [Dataset Splitting Strategy](#11-dataset-splitting-strategy)
12. [Model Evaluation Framework](#12-model-evaluation-framework)
13. [Recall and False Negative Analysis](#13-recall-and-false-negative-analysis)
14. [Precision and False Positive Analysis](#14-precision-and-false-positive-analysis)
15. [Risk Threshold Optimization](#15-risk-threshold-optimization)
16. [Probability Calibration](#16-probability-calibration)
17. [Historical Replay Testing](#17-historical-replay-testing)
18. [Historical Replay Dataset](#18-historical-replay-dataset)
19. [Stress Testing](#19-stress-testing)
20. [Feature Importance and Explainability](#20-feature-importance-and-explainability)
21. [Model Validation Report](#21-model-validation-report)
22. [Model Acceptance Criteria](#22-model-acceptance-criteria)
23. [Model Freeze](#23-model-freeze)
24. [Model Version Metadata](#24-model-version-metadata)
25. [FastAPI Prediction API](#25-fastapi-prediction-api)
26. [Batch Prediction API](#26-batch-prediction-api)
27. [Historical Replay API](#27-historical-replay-api)
28. [Health and Model APIs](#28-health-and-model-apis)
29. [Input Validation](#29-input-validation)
30. [ML Runtime Architecture](#30-ml-runtime-architecture)
31. [Integration With .NET](#31-integration-with-net)
32. [Production Project Structure](#32-production-project-structure)
33. [Testing Strategy](#33-testing-strategy)
34. [Performance Requirements](#34-performance-requirements)
35. [Observability](#35-observability)
36. [Future ML Capabilities](#36-future-ml-capabilities)
37. [Critical Product Principles](#37-critical-product-principles)
38. [Definition of Done](#38-definition-of-done)

---

## 1. Product Context

### Problem Statement

The North Eastern Region (NER) of India — encompassing Assam, Meghalaya, Mizoram, Nagaland, Manipur, Tripura, Arunachal Pradesh and Sikkim — frequently experiences landslides due to a convergence of environmental and anthropogenic factors:

- **Heavy rainfall** — especially during the monsoon season (June–September)
- **Steep terrain** — rugged hills and mountainous topography
- **Fragile geology** — weak rock formations and weathered substrates
- **Soil saturation** — prolonged moisture retention in hillslopes
- **Hill cutting** — road construction and urban expansion destabilizing slopes
- **Deforestation and land-use change** — reducing root-anchored slope stability
- **Seismic activity** — the NER lies in seismic zones IV and V

These landslides cause loss of life, destruction of infrastructure, displacement of communities and disruption of essential services. Existing early-warning mechanisms are largely reactive, relying on post-event reporting rather than predictive risk assessment.

### The Larger Platform

The broader AI-Based Early Warning and Landslide Risk Monitoring System will collect and analyze the following data streams:

| Data Category | Examples |
|---|---|
| Rainfall | Hourly, daily, cumulative rainfall from weather stations and remote sensing |
| Soil Moisture | In-situ sensors, satellite-derived soil-moisture indices |
| Terrain / Elevation | Digital Elevation Models (DEMs), slope, aspect, curvature |
| Historical Landslide Events | Government records, NASA catalogs, field surveys |
| Land-Cover Information | Satellite-derived vegetation and land-use classification |
| Satellite-Derived Indicators | NDVI, surface deformation, soil-wetness indices |
| Geographic Information | Road networks, river proximity, administrative boundaries |
| Field Reports | Ground-truth observations from field teams |
| Sensor Data | IoT sensors for tilt, moisture, displacement |

### Role of the ML Engine

The ML Engine transforms relevant environmental and geographic features into actionable risk predictions:

```
Environmental Data
        ↓
Feature Engineering
        ↓
ML Model
        ↓
Landslide Probability
        ↓
Risk Classification
        ↓
Explainable Prediction
```

> [!IMPORTANT]
> The ML Engine is a **decision-support system**, not an autonomous disaster-management authority. It must never claim that a landslide will definitely occur. All predictions are probabilistic estimates intended to inform — not replace — human decision-making by disaster-management professionals.

---

## 2. Product Vision

> Build an independently deployable machine learning service capable of estimating landslide risk for geographic locations using historical and environmental data, while providing reliable probability estimates, risk classifications, explanations and model metadata that can be consumed by the main .NET disaster-management platform.

### Core Priorities

The system must prioritize — in order of importance:

| Priority | Rationale |
|---|---|
| **Reliability** | Predictions must be consistent, reproducible and available when needed |
| **Explainability** | Every prediction must be accompanied by interpretable contributing factors |
| **Reproducibility** | The same inputs, model version and feature pipeline must produce the same outputs |
| **Validation** | Model performance must be rigorously evaluated before production deployment |
| **Geographic Generalization** | The model should perform well across NER states, not only in training regions |
| **Temporal Generalization** | The model should perform well on future time periods, not only on training periods |
| **Model Versioning** | Every model artifact must be versioned, traceable and frozen before serving |
| **Operational Usefulness** | Predictions must be actionable by disaster-management teams in the field |

---

## 3. Product Goals

The ML Engine must achieve the following product goals:

| # | Goal |
|---|---|
| 1 | Predict landslide probability for a geographic location |
| 2 | Produce a normalized risk score between 0 and 1 |
| 3 | Convert risk scores into configurable severity levels (LOW, MEDIUM, HIGH, CRITICAL) |
| 4 | Provide prediction confidence/probability information |
| 5 | Explain the major factors contributing to a prediction |
| 6 | Support individual predictions (single location) |
| 7 | Support batch predictions for multiple zones |
| 8 | Support historical replay/testing |
| 9 | Support model evaluation |
| 10 | Support temporal validation (train on past, test on future) |
| 11 | Support geographic validation (train on region A, test on region B) |
| 12 | Support probability calibration |
| 13 | Detect and prevent data leakage |
| 14 | Support model versioning |
| 15 | Support feature-version tracking |
| 16 | Provide model metadata via API |
| 17 | Provide health/readiness endpoints |
| 18 | Be independently deployable (Docker container) |
| 19 | Be consumable by the .NET backend through a stable REST API |
| 20 | Allow future ML models to replace the initial model without changing the core API contract |

---

## 4. Explicit Non-Goals

The initial ML microservice must **NOT**:

| Non-Goal | Responsible System |
|---|---|
| Manage application users | .NET Backend |
| Manage authorization | .NET Backend |
| Send SMS directly | .NET Backend / Notification Service |
| Manage emergency workflows | .NET Backend |
| Manage citizen accounts | .NET Backend |
| Build the React GIS interface | React Frontend |
| Replace government disaster-management decisions | Human authorities |
| Guarantee landslide occurrence | Scientifically impossible |
| Automatically order evacuations | Human authorities |
| Train models during prediction requests | Offline Training Pipeline |
| Require deep learning for the initial model | Future Iteration |
| Require raw satellite-image deep learning in the MVP | Future Iteration |
| Become responsible for the complete weather/sensor ingestion architecture | .NET Backend / Data Platform |

> [!NOTE]
> These responsibilities belong to the broader .NET platform, the React frontend, human authorities, or future specialized services. The ML Engine must remain focused on **inference, explainability, and model management**.

---

## 5. Recommended Technology Stack

### 5.1 Core Framework

| Technology | Purpose | Justification |
|---|---|---|
| **Python 3.11+** | Primary language | Industry standard for ML; rich ecosystem of scientific libraries |
| **FastAPI** | Web framework | Async support, automatic OpenAPI documentation, Pydantic integration, high performance |
| **Pydantic** | Data validation | Type-safe request/response schemas with automatic validation |
| **Uvicorn** | ASGI server | High-performance async server for FastAPI |

### 5.2 Data Science

| Technology | Purpose |
|---|---|
| **Pandas** | Tabular data manipulation, feature engineering |
| **NumPy** | Numerical computation, array operations |
| **Scikit-learn** | ML algorithms, preprocessing, evaluation metrics, calibration |

### 5.3 ML Models

The initial experimentation phase must compare at least the following algorithms:

| Model | Rationale |
|---|---|
| **Logistic Regression** | Interpretable baseline; establishes minimum performance floor |
| **Random Forest** | Ensemble method; handles non-linearity; built-in feature importance |
| **XGBoost** | Gradient boosting; typically strong performance on tabular data; handles missing values natively |

> [!IMPORTANT]
> The system must be designed so that the final model can be replaced without changing the external API contract. The API accepts features and returns risk predictions — the internal model is an implementation detail.

### 5.4 Explainability

| Technology | Purpose |
|---|---|
| **SHAP** | Local and global feature explanations; model-agnostic where needed |
| **Built-in Feature Importance** | Tree-based models provide native feature importance |
| **Local Prediction Explanations** | Per-prediction contributing factors for downstream display |

### 5.5 Geospatial

| Technology | Purpose |
|---|---|
| **GeoPandas** | Geospatial dataframe operations |
| **Shapely** | Geometric operations (buffering, distance calculations) |
| **Rasterio** | Reading/writing raster data (DEMs, satellite-derived layers) |
| **PyProj** | Coordinate reference system transformations |

> [!NOTE]
> Geospatial libraries should be used only where required — primarily in the training/feature-engineering pipeline and data preprocessing. The inference API should receive pre-computed features rather than performing heavy GIS operations at request time.

### 5.6 Testing

| Technology | Purpose |
|---|---|
| **Pytest** | Unit testing, integration testing, ML evaluation tests |
| **HTTPX** | Async HTTP client for FastAPI integration testing |

### 5.7 Code Quality

| Technology | Purpose |
|---|---|
| **Ruff** | Fast Python linter |
| **Black** | Opinionated code formatter |
| **MyPy** | Static type checking (where appropriate) |

### 5.8 Deployment

| Technology | Purpose |
|---|---|
| **Docker** | Containerized deployment; reproducible environments |
| **Uvicorn / Gunicorn** | Production ASGI/WSGI server with worker management |

---

## 6. Data Strategy

### 6.1 Multi-Source Data Integration

> [!CAUTION]
> Do NOT assume that one dataset will contain all required features. The training dataset must be constructed by integrating multiple open/public data sources, each covering different aspects of landslide risk.

### 6.2 Potential Data Sources

| Data Source | Type | Coverage |
|---|---|---|
| **NASA Global Landslide Catalog** | Landslide events (labels) | Global, including NER events |
| **NASA Earth Observation (TRMM, GPM, SMAP)** | Rainfall, soil moisture | Global / regional |
| **India Meteorological Department (IMD)** | Rainfall, weather | India-wide |
| **Geological Survey of India (GSI)** | Landslide inventory, geology | India-wide |
| **National Remote Sensing Centre (NRSC)** | Satellite imagery, DEM | India-wide |
| **Sentinel-1 / Sentinel-2** | SAR, optical satellite data | Global |
| **SRTM / ASTER / ALOS PALSAR DEM** | Elevation, slope, aspect | Global |
| **NASA SMAP / ESA CCI Soil Moisture** | Soil moisture | Global |
| **OpenStreetMap** | Road networks, rivers, land use | Global |
| **MODIS / Copernicus Land Cover** | Land-cover classification | Global / regional |
| **NDMA / SDMA Disaster Records** | Historical disaster events | India / NER |
| **ERA5 / ERA5-Land (ECMWF)** | Reanalysis rainfall, soil moisture | Global |

### 6.3 Dataset Documentation Requirements

Every dataset used in training or evaluation **must** have the following recorded:

| Field | Description |
|---|---|
| **Dataset Source** | Organization or platform providing the data |
| **Dataset Version** | Version identifier or access date snapshot |
| **License** | Terms of use, redistribution rights, attribution requirements |
| **Download Date** | When the data was acquired |
| **Geographic Coverage** | Spatial extent (bounding box, region names) |
| **Temporal Coverage** | Start and end dates of the data |
| **Processing Steps** | Transformations applied (reprojection, resampling, cleaning) |
| **Feature Definitions** | What each variable represents, units, resolution |
| **Missing-Data Handling** | How gaps, nulls and invalid values were addressed |
| **Data Quality Notes** | Known issues, limitations, caveats |

### 6.4 NER Data Prioritization

> [!IMPORTANT]
> Prioritize datasets covering **Northeast India**. US/global datasets may be used for experimentation, methodology development, or supplementary training only where scientifically justified. The final model evaluation **must** prioritize NER-specific data to ensure operational relevance.

---

## 7. Training Dataset Design

### 7.1 Supervised Learning Problem

The training dataset is framed as a **binary classification** problem:

| Feature | Description | Example |
|---|---|---|
| `Date` | Date/timestamp of the observation | 2021-07-15 |
| `Latitude` | Latitude of the location | 25.5781 |
| `Longitude` | Longitude of the location | 91.8933 |
| `Rainfall_1h` | 1-hour rainfall (mm) | 22 |
| `Rainfall_6h` | 6-hour cumulative rainfall (mm) | 61 |
| `Rainfall_12h` | 12-hour cumulative rainfall (mm) | 95 |
| `Rainfall_24h` | 24-hour cumulative rainfall (mm) | 142 |
| `Rainfall_3d` | 3-day cumulative rainfall (mm) | 285 |
| `Rainfall_7d` | 7-day cumulative rainfall (mm) | 421 |
| `Rainfall_30d` | 30-day cumulative rainfall (mm) | 890 |
| `Soil_Moisture` | Soil moisture (%) | 84 |
| `Elevation` | Elevation above sea level (m) | 1400 |
| `Slope` | Slope angle (degrees) | 38 |
| `Aspect` | Slope aspect/direction (degrees) | 180 |
| `Curvature` | Surface curvature | -0.02 |
| `Land_Cover` | Land-cover class | Forest |
| `Historical_Landslide_Count` | Number of past landslides within buffer | 4 |
| `Distance_To_Road` | Distance to nearest road (m) | 350 |
| `Distance_To_River` | Distance to nearest river (m) | 1200 |
| **`Landslide`** | **Target label** | **1 or 0** |

Where:

- `Landslide = 1` — a landslide occurred within the defined prediction window and location buffer
- `Landslide = 0` — no landslide occurred

### 7.2 Sample Generation

The PRD requires explicit design for how positive and negative samples are constructed.

#### Positive Samples (Landslide = 1)

- Sourced from known landslide inventories (NASA GLC, GSI, NDMA)
- Each event mapped to its geographic coordinates and date
- Features computed using data available **before** the event date (see [Section 9](#9-data-leakage-prevention))
- A **prediction window** must be defined (e.g., "landslide occurring within 24–72 hours of the observation")

#### Negative Samples (Landslide = 0)

- Locations where no landslide was recorded during the observation period
- Must be sampled from the same geographic and temporal domain as positive samples
- Sampling strategies to consider:
  - **Random spatial sampling** within NER
  - **Matched sampling** — same region, different time (no event)
  - **Buffer exclusion** — exclude areas within N km of known events to avoid spatial leakage

### 7.3 Critical Design Decisions

| Issue | Requirement |
|---|---|
| **Spatial Sampling** | Define minimum distance between positive and negative samples to avoid spatial autocorrelation |
| **Temporal Sampling** | Ensure negative samples span the same temporal range as positive samples |
| **Prediction Window** | Define explicitly (e.g., 24h, 48h, 72h) — determines when features are snapshot relative to the event |
| **Event Definition** | Define what constitutes a "landslide event" — minimum size, type (debris flow, rockslide, etc.) |
| **Negative Sample Selection** | Document the ratio and method (e.g., 1:5 or 1:10 positive-to-negative) |
| **Class Imbalance** | Address using oversampling (SMOTE), undersampling, class weights, or threshold tuning |
| **Duplicate Events** | De-duplicate events reported by multiple sources for the same location/date |
| **Spatial Duplicates** | Merge events within a defined spatial buffer (e.g., 1 km) on the same date |
| **Missing Labels** | Document how unlabeled regions are treated — absence of a record ≠ confirmed non-event |

---

## 8. Feature Engineering

### 8.1 Feature Categories

#### Rainfall Features

| Feature | Description | Unit |
|---|---|---|
| `Rainfall_1h` | 1-hour rainfall | mm |
| `Rainfall_6h` | 6-hour cumulative rainfall | mm |
| `Rainfall_12h` | 12-hour cumulative rainfall | mm |
| `Rainfall_24h` | 24-hour cumulative rainfall | mm |
| `Rainfall_3d` | 3-day cumulative rainfall | mm |
| `Rainfall_7d` | 7-day cumulative rainfall | mm |
| `Rainfall_30d` | 30-day cumulative rainfall | mm |

#### Terrain Features

| Feature | Description | Unit |
|---|---|---|
| `Elevation` | Height above sea level | m |
| `Slope` | Slope angle | degrees |
| `Aspect` | Slope direction | degrees |
| `Curvature` | Surface curvature (plan/profile) | 1/m |
| `Terrain_Ruggedness` | Terrain Ruggedness Index (TRI) | — |

#### Soil Features

| Feature | Description | Unit |
|---|---|---|
| `Soil_Moisture` | Volumetric soil moisture | % |
| `Soil_Type` | Categorical soil classification | class |

#### Historical Features

| Feature | Description | Unit |
|---|---|---|
| `Historical_Landslide_Count` | Number of past landslides within spatial buffer | count |
| `Historical_Landslide_Density` | Landslide density per unit area | events/km² |
| `Distance_From_Historical` | Distance to nearest historical landslide | m |

#### Geographic Features

| Feature | Description | Unit |
|---|---|---|
| `Distance_To_Road` | Distance to nearest road | m |
| `Distance_To_River` | Distance to nearest river | m |
| `Land_Cover` | Land-cover classification | class |
| `NDVI` | Normalized Difference Vegetation Index | — |

### 8.2 Feature Pipeline Consistency

> [!CAUTION]
> The feature pipeline used during **training** MUST be identical to the feature pipeline used during **inference**. Any transformation, scaling, encoding or derivation applied during training must be reproduced exactly during prediction. Failure to maintain pipeline consistency will produce incorrect predictions that are difficult to diagnose.

Implementation requirements:

- Feature transformations must be serialized with the model artifact
- Categorical encodings must be frozen at training time
- Scaling parameters (mean, std, min, max) must be frozen at training time
- Feature ordering must be deterministic
- Feature version must be tracked alongside model version

---

## 9. Data Leakage Prevention

> [!CAUTION]
> **This section is mandatory.** Data leakage is one of the most common and dangerous errors in machine learning. It occurs when information from the future or from the test set inadvertently influences the training process, producing models that appear to perform well in evaluation but fail catastrophically in production.

### 9.1 Temporal Leakage

Future information must **never** be used to predict a past event.

**Example:** If predicting a landslide on **15 July 2021**, the model must only use information that would have been available **before** the prediction time.

### 9.2 Mandatory Leakage Prevention Rules

| Rule | Description |
|---|---|
| **Temporal Feature Cutoff** | All features must be computed from data available before the prediction timestamp |
| **Historical-Only Feature Generation** | `Historical_Landslide_Count` must only count events that occurred **before** the prediction date |
| **No Post-Event Satellite Information** | Satellite-derived features must use pre-event imagery only |
| **No Future Rainfall** | Rainfall features must use observed (historical) values, not forecasts, during training |
| **No Future Sensor Readings** | Sensor data must be cut off at or before the prediction timestamp |
| **No Future Landslide Information** | The target variable and related features must not leak future outcomes |
| **Proper Train/Validation/Test Separation** | Temporal splits must prevent any training data from post-dating validation/test data |

### 9.3 Automated Leakage Checks

The system must include automated checks where practical:

- **Timestamp validation** — verify that all feature timestamps precede the prediction timestamp
- **Feature date assertions** — assert that no feature in the training matrix was generated from data after the event date
- **Train/test contamination check** — verify that no training sample appears in the validation or test set
- **Spatial buffer check** — verify that training and test samples maintain minimum spatial separation
- **Pipeline audit log** — record the data cutoff date used for each feature during generation

---

## 10. Model Development Strategy

### 10.1 Progressive Modeling

> [!IMPORTANT]
> The ML team must NOT immediately train a complex model. Follow a progressive modeling approach where each stage builds upon the previous one and performance is compared objectively.

```
Baseline (majority class / simple heuristic)
   ↓
Logistic Regression
   ↓
Random Forest
   ↓
XGBoost
   ↓
Hyperparameter Tuning
   ↓
Calibration
   ↓
Final Model
```

### 10.2 Stage Requirements

| Stage | Purpose | Output |
|---|---|---|
| **Baseline** | Establish minimum performance floor (e.g., predict majority class, or use rainfall threshold) | Baseline metrics |
| **Logistic Regression** | Interpretable linear model; identifies linear relationships | Metrics + coefficients |
| **Random Forest** | Non-linear ensemble; robust to overfitting | Metrics + feature importance |
| **XGBoost** | Gradient boosting; typically highest performance on tabular data | Metrics + feature importance |
| **Hyperparameter Tuning** | Optimize the best-performing model | Tuned model + metrics |
| **Calibration** | Ensure predicted probabilities reflect true event frequencies | Calibrated model + reliability diagram |
| **Final Model** | Production-ready, versioned model artifact | Frozen model + validation report |

### 10.3 Model Comparison

The PRD requires side-by-side comparison of all candidate models using identical:

- Training data
- Feature set
- Evaluation split
- Evaluation metrics

The final model must be selected using **objective evaluation criteria** (see [Section 12](#12-model-evaluation-framework)) rather than model popularity or team preference.

---

## 11. Dataset Splitting Strategy

### 11.1 Primary Split: Temporal

> [!WARNING]
> Do NOT rely only on random train/test splitting. Random splits can leak temporal patterns and produce overly optimistic performance estimates. The primary evaluation must use **temporal splitting**.

**Example temporal split:**

| Split | Period | Purpose |
|---|---|---|
| **Training** | 2015–2021 | Model learning |
| **Validation** | 2022–2023 | Hyperparameter tuning, threshold selection |
| **Final Test** | 2024–2025 | Held-out evaluation (used once) |

> [!NOTE]
> The exact years must depend on available data. The principle is: train on earlier data, validate on later data, and perform final testing on the most recent data.

### 11.2 Secondary Split: Geographic

Where sufficient geographic data exists, also perform geographic validation:

**Example geographic split:**

| Split | Regions | Purpose |
|---|---|---|
| **Training** | Meghalaya + Assam | Model learning |
| **Geographic Test** | Mizoram | Evaluate cross-region generalization |

The goal is to determine whether the model generalizes beyond the locations and events it has seen during training. If the model performs well only in Meghalaya but fails in Mizoram, its operational utility across NER is limited.

### 11.3 Split Integrity

- No data from the validation or test period may appear in the training set
- No data from the test set may be used for hyperparameter tuning
- Geographic test regions must be entirely excluded from training
- Split metadata must be recorded in the model validation report

---

## 12. Model Evaluation Framework

### 12.1 Required Metrics

| Metric | Description | Priority |
|---|---|---|
| **Precision** | Of all predicted landslides, how many actually occurred? | High |
| **Recall** | Of all actual landslides, how many did the model detect? | **Critical** |
| **F1 Score** | Harmonic mean of precision and recall | High |
| **ROC-AUC** | Area under the Receiver Operating Characteristic curve | High |
| **PR-AUC** | Area under the Precision-Recall curve | **Critical** |
| **Confusion Matrix** | True positives, true negatives, false positives, false negatives | High |
| **False Positive Rate** | Rate of false alarms | Medium |
| **False Negative Rate** | Rate of missed landslides | **Critical** |
| **Probability Calibration** | Agreement between predicted probability and observed frequency | High |

### 12.2 Why Accuracy Is Not the Primary Metric

> [!WARNING]
> Do NOT use accuracy as the primary success metric.

A landslide dataset is typically **highly imbalanced**. Consider:

```
9,900 non-landslides
  100 landslides
```

A model that predicts "no landslide" for every input achieves **99% accuracy** while detecting **zero actual landslides**. This model is operationally useless and potentially dangerous.

Therefore, the evaluation must prioritize metrics that are meaningful for the **positive class** (landslide events):

- **Recall** — ensures real events are not missed
- **PR-AUC** — evaluates performance under class imbalance
- **F1** — balances precision and recall

---

## 13. Recall and False Negative Analysis

### 13.1 Definition

```
False Negative =
    Actual landslide occurred
    +
    Model predicted no risk or highly insufficient risk
```

A false negative means the system **failed to warn** about a real landslide. In a disaster early-warning context, this is the most dangerous type of error.

### 13.2 Why False Negatives Are Critical

- A missed warning can result in **loss of life**
- Downstream systems (alerts, evacuations, road closures) will not activate
- Community trust in the system is destroyed if real events go unwarned
- The primary purpose of the system is to **detect risk before it materializes**

### 13.3 Required Analysis

For every significant false negative in the evaluation, the following must be investigated:

| Factor | Investigation |
|---|---|
| **Rainfall** | Was rainfall data available and accurate? Was it unusually low despite a real event? |
| **Soil Moisture** | Was soil moisture captured? Was there a sensor gap? |
| **Terrain** | Was slope/elevation correctly represented for this location? |
| **Historical Activity** | Were past events in this area recorded in the training data? |
| **Land Cover** | Was the land-cover classification accurate? |
| **Geographic Location** | Was this location well-represented in training data? |
| **Data Quality** | Were features missing, stale, or incorrect? |
| **Feature Availability** | Were key features unavailable for this prediction? |

### 13.4 Outcome

The false-negative analysis must produce:

- A count and percentage of missed events
- A categorization of root causes
- Recommendations for improving detection (additional data, features, or model adjustments)

---

## 14. Precision and False Positive Analysis

### 14.1 Definition

```
False Positive =
    No landslide occurred
    +
    Model predicted high or critical risk
```

### 14.2 Impact of Excessive False Positives

| Impact | Description |
|---|---|
| **Alert Fatigue** | Emergency responders begin ignoring warnings if too many are false |
| **Unnecessary Field Inspections** | Resources deployed to non-risk areas |
| **Resource Wastage** | Diversion of limited disaster-management resources |
| **Reduced Trust** | Decision-makers lose confidence in the system |

### 14.3 Required Analysis

- Count and rate of false positives across all risk levels
- Geographic clustering of false positives
- Feature profiles of false-positive predictions
- Comparison of false-positive rates across models and thresholds

### 14.4 Balancing False Negatives and False Positives

> [!IMPORTANT]
> The system must balance false negatives (missed events) and false positives (false alarms). In an early-warning system, **missing a real landslide is generally more costly than issuing a false alarm** — but excessive false alarms erode the system's operational value. Threshold optimization (see [Section 15](#15-risk-threshold-optimization)) must address this trade-off explicitly.

---

## 15. Risk Threshold Optimization

### 15.1 No Hardcoded Thresholds

> [!WARNING]
> Do NOT hardcode `75% = Critical` without evaluation. Risk thresholds must be determined empirically by analyzing model performance at different probability cutoffs.

### 15.2 Threshold Analysis

The following probability thresholds must be tested:

| Threshold | Precision | Recall | F1 | False Positives | False Negatives |
|---|---|---|---|---|---|
| 0.50 | — | — | — | — | — |
| 0.60 | — | — | — | — | — |
| 0.70 | — | — | — | — | — |
| 0.80 | — | — | — | — | — |
| 0.90 | — | — | — | — | — |

Thresholds should be selected based on:

- Model performance metrics at each cutoff
- Disaster-management operational requirements
- Acceptable false-negative rate
- Tolerable false-positive rate
- Stakeholder input

### 15.3 Configurable Risk Categories

Risk categories must remain **configurable** and validated against model performance:

| Risk Score Range | Risk Level | Description |
|---|---|---|
| 0.00 – 0.30 | **LOW** | Minimal risk; routine monitoring |
| 0.30 – 0.50 | **MEDIUM** | Elevated risk; increased monitoring recommended |
| 0.50 – 0.75 | **HIGH** | Significant risk; alert field teams, prepare response |
| 0.75 – 1.00 | **CRITICAL** | Severe risk; immediate attention required |

> [!NOTE]
> These are **initial values only** and must be validated against historical events and model calibration before production deployment. Thresholds may differ for different geographic regions or seasons.

---

## 16. Probability Calibration

### 16.1 The Calibration Problem

A model may output a risk score of `0.90`, but that does **not** automatically mean the real-world event probability is 90%. Many ML models — particularly tree-based ensembles — produce scores that are not well-calibrated probabilities.

### 16.2 Calibration Methods

The following calibration techniques must be evaluated:

| Method | Description |
|---|---|
| **Calibration Curve (Reliability Diagram)** | Plots predicted probability vs. observed frequency |
| **Brier Score** | Measures mean squared error of probability predictions |
| **Platt Scaling** | Fits a logistic regression on model outputs to produce calibrated probabilities |
| **Isotonic Regression** | Non-parametric calibration using isotonic regression |

### 16.3 Terminology Distinction

> [!IMPORTANT]
> The final API must distinguish between the following terms. They must NOT be used interchangeably without definition.

| Term | Definition |
|---|---|
| **Risk Score** | The raw model output (0–1), representing relative risk ranking |
| **Probability** | A calibrated estimate of the likelihood of a landslide event |
| **Confidence** | A measure of the model's certainty in its prediction (e.g., based on prediction variance or ensemble agreement) |

---

## 17. Historical Replay Testing

### 17.1 Purpose

> [!IMPORTANT]
> Historical replay is a **mandatory** feature of the ML validation system. It is one of the primary mechanisms for establishing model credibility.

The system must simulate:

> *"What would the model have predicted if it had been running at that historical time?"*

### 17.2 Example Replay

```
─────────────────────────────────────────
Historical Date:    15 July 2021
Location:           25.57°N, 91.89°E

Available Information (as of prediction time):
  Rainfall_24h        = 142 mm
  Soil_Moisture       = 84%
  Slope               = 38°
  Elevation           = 1,400 m
  Historical_Landslides = 4

Model Prediction:
  Risk Score          = 0.89
  Risk Level          = CRITICAL

Actual Outcome:
  Landslide occurred  ✓

Result:              CORRECT WARNING
─────────────────────────────────────────
```

### 17.3 Replay Output

The replay system must produce aggregate statistics across all replayed events:

| Metric | Value |
|---|---|
| **Total Events Replayed** | — |
| **Correct Warnings** (true positives) | — |
| **Missed Events** (false negatives) | — |
| **False Alarms** (false positives) | — |
| **Recall** | — |
| **Precision** | — |
| **F1 Score** | — |

### 17.4 Constraints

- The replay system must **never** use future information
- Features must be computed using only data available before the event timestamp
- The replay must use the same model artifact and feature pipeline as the production system
- Results must be reproducible

---

## 18. Historical Replay Dataset

### 18.1 Dataset Structure

The replay dataset must contain:

| Field | Description |
|---|---|
| `Timestamp` | Date/time of the historical event or observation |
| `Location` | Latitude, longitude (and optionally region name) |
| `Features` | All features available before prediction time |
| `Model_Prediction` | Risk score, risk level, contributing factors |
| `Actual_Outcome` | Whether a landslide actually occurred (1/0) |
| `Prediction_Correctness` | Classification: TP, FP, TN, FN |

### 18.2 Integrity Requirements

- The replay dataset must be constructed independently from the training data split
- Feature values must reflect only historically available information
- The dataset must cover multiple NER states and monsoon seasons
- Each replay record must be traceable to its source event

---

## 19. Stress Testing

### 19.1 Purpose

The model must be tested against **extreme but physically plausible conditions** to ensure predictions behave sensibly at the boundaries of the feature space.

### 19.2 Rainfall Stress Scenarios

| Scenario | Rainfall_24h (mm) | Expected Behavior |
|---|---|---|
| Dry conditions | 0–10 | Low risk (unless other factors are extreme) |
| Moderate rain | 30 | Low to moderate risk |
| Heavy rain | 100 | Moderate to high risk |
| Very heavy rain | 150 | High risk |
| Extreme rain | 200 | High to critical risk |
| Exceptional rain | 300+ | Critical risk |

### 19.3 Multi-Factor Stress Combinations

Test varying combinations of:

- **Soil Moisture** (10%, 30%, 50%, 70%, 90%)
- **Slope** (5°, 15°, 25°, 35°, 45°)
- **Elevation** (100m, 500m, 1000m, 1500m, 2500m)
- **Historical Risk** (0, 2, 5, 10, 20 past events)

### 19.4 Edge-Case Testing

| Test Case | Purpose |
|---|---|
| **Missing values** | How does the model handle null or NaN features? |
| **Boundary values** | Features at minimum/maximum plausible limits |
| **Invalid values** | Negative rainfall, slope > 90°, moisture > 100% |
| **Unusually high rainfall** | 500mm+ in 24 hours |
| **Unusual combinations** | High rainfall + flat terrain + dry soil |
| **Zero historical events** | Location with no landslide history but high current risk factors |

### 19.5 Expected Outcome

- The model must not produce nonsensical predictions (e.g., risk decreasing as rainfall increases, all else equal)
- The model must handle missing data gracefully (either through imputation or explicit handling)
- The model must not crash or return errors for valid extreme inputs

---

## 20. Feature Importance and Explainability

### 20.1 Global Feature Importance

The model must provide **global feature importance** — a ranking of which features contribute most to predictions across the entire dataset.

**Example:**

| Feature | Importance |
|---|---|
| `Rainfall_24h` | 31% |
| `Soil_Moisture` | 23% |
| `Slope` | 18% |
| `Historical_Landslide_Count` | 12% |
| `Elevation` | 9% |
| `Land_Cover` | 7% |

### 20.2 Local Prediction Explanations

For individual predictions, the API must provide **local explanations** — the specific factors driving that particular prediction.

**Example:**

```
Prediction: 0.87 — CRITICAL

Contributing Factors:
┌───────────────────────────┬──────────────┐
│ Feature                   │ Impact       │
├───────────────────────────┼──────────────┤
│ Rainfall_24h = 142mm      │ HIGH IMPACT  │
│ Soil_Moisture = 84%       │ HIGH IMPACT  │
│ Slope = 38°               │ MEDIUM IMPACT│
│ Historical_Landslides = 4 │ MEDIUM IMPACT│
│ Elevation = 1420m         │ LOW IMPACT   │
└───────────────────────────┴──────────────┘
```

### 20.3 SHAP Integration

Use **SHAP (SHapley Additive exPlanations)** where appropriate to provide:

- Global SHAP summary plots
- Per-prediction SHAP values
- Feature interaction analysis

### 20.4 Causality Disclaimer

> [!WARNING]
> Feature contribution does **not** automatically establish real-world causality. A high SHAP value for `Rainfall_24h` means the feature strongly influences the model's prediction — it does not prove that rainfall alone caused the landslide. Explanations must be presented as model behavior, not as causal scientific claims.

---

## 21. Model Validation Report

### 21.1 Purpose

The training pipeline must produce a **formal Model Validation Report** for every model version. This report is a prerequisite for production deployment.

### 21.2 Report Template

```
══════════════════════════════════════════
        MODEL VALIDATION REPORT
══════════════════════════════════════════

Model:              XGBoost v1.0.0
Dataset:            NER Landslide Dataset v1.0
Feature Version:    1.0.0

──────────────────────────────────────────
TRAINING CONFIGURATION
──────────────────────────────────────────
Training Period:    2015–2021
Validation Period:  2022–2023
Final Test Period:  2024–2025
Algorithm:          XGBoost
Hyperparameters:    {max_depth: 6, n_estimators: 500, ...}

──────────────────────────────────────────
EVALUATION RESULTS (FINAL TEST SET)
──────────────────────────────────────────
Precision:          0.78
Recall:             0.86
F1 Score:           0.82
ROC-AUC:            0.91
PR-AUC:             0.74
False Negatives:    14
False Positives:    31

──────────────────────────────────────────
```

### 21.3 Required Report Sections

| Section | Contents |
|---|---|
| **Dataset Characteristics** | Size, sources, geographic coverage, temporal range |
| **Class Distribution** | Positive/negative ratio, per-region breakdown |
| **Feature List** | All features used, versions, sources |
| **Data Leakage Checks** | Results of automated leakage validation |
| **Temporal Validation** | Performance on time-split test set |
| **Geographic Validation** | Performance on held-out regions (where available) |
| **Calibration Results** | Calibration curve, Brier score, calibration method |
| **Historical Replay Results** | Replay statistics across known events |
| **Stress-Testing Results** | Behavior under extreme/edge-case conditions |
| **Feature Importance** | Global and local importance analysis |
| **Known Limitations** | Data gaps, regions with poor coverage, seasonal biases |

---

## 22. Model Acceptance Criteria

### 22.1 Pre-Production Checklist

The model must **NOT** be considered production-ready merely because it has high accuracy. Before model freeze, the following must be verified:

- [ ] Dataset quality reviewed
- [ ] NER-specific data evaluated
- [ ] Data leakage checked
- [ ] Temporal validation completed
- [ ] Geographic validation completed (where possible)
- [ ] Class imbalance addressed
- [ ] Precision calculated
- [ ] Recall calculated
- [ ] F1 calculated
- [ ] ROC-AUC calculated
- [ ] PR-AUC calculated
- [ ] Confusion matrix reviewed
- [ ] False negatives analyzed
- [ ] False positives analyzed
- [ ] Probability calibration evaluated
- [ ] Risk thresholds evaluated
- [ ] Historical replay completed
- [ ] Extreme-condition testing completed
- [ ] Missing-data testing completed
- [ ] Explainability reviewed
- [ ] Model reproducibility verified
- [ ] Model version created
- [ ] Validation report generated

### 22.2 Production Candidate Status

Only after **all** items in the checklist are satisfied should the model be marked:

```
╔══════════════════════════════════════╗
║       PRODUCTION CANDIDATE           ║
╚══════════════════════════════════════╝
```

---

## 23. Model Freeze

### 23.1 Freeze Composition

Once a model is accepted as a production candidate, the following must be frozen as a **versioned artifact**:

| Component | Description |
|---|---|
| **Model** | Serialized trained model (e.g., `.joblib`, `.pkl`, `.json`) |
| **Feature Pipeline** | Serialized transformers, scalers, encoders |
| **Feature Configuration** | Feature names, types, ordering, versions |
| **Training Dataset Version** | Reference to the exact dataset used |
| **Model Metadata** | Hyperparameters, training date, metrics |
| **Validation Report** | Complete validation report (see [Section 21](#21-model-validation-report)) |

### 23.2 Versioning Scheme

Example version identifier:

```
xgboost-v1.0.0
```

Format: `{algorithm}-v{major}.{minor}.{patch}`

- **Major:** Significant model architecture or feature set changes
- **Minor:** Hyperparameter tuning, additional training data, recalibration
- **Patch:** Bug fixes, metadata updates (no model changes)

### 23.3 Production Loading

The FastAPI service must load this frozen artifact at startup. The production API must **NOT** retrain the model during serving.

---

## 24. Model Version Metadata

### 24.1 Required Metadata Fields

Each model version must record:

| Field | Example |
|---|---|
| `model_name` | `xgboost` |
| `model_version` | `1.0.0` |
| `training_dataset_version` | `ner-landslide-v1.0` |
| `feature_version` | `1.0.0` |
| `training_date` | `2026-08-20T10:00:00Z` |
| `training_period` | `2015-01-01 to 2021-12-31` |
| `validation_period` | `2022-01-01 to 2023-12-31` |
| `test_period` | `2024-01-01 to 2025-12-31` |
| `algorithm` | `XGBoost` |
| `hyperparameters` | `{max_depth: 6, n_estimators: 500, learning_rate: 0.05}` |
| `evaluation_metrics` | `{precision: 0.78, recall: 0.86, f1: 0.82, roc_auc: 0.91}` |
| `calibration_method` | `isotonic_regression` |
| `risk_thresholds` | `{low: [0, 0.3], medium: [0.3, 0.5], high: [0.5, 0.75], critical: [0.75, 1.0]}` |

### 24.2 Prediction Response Requirement

Every prediction response must contain the model version:

```json
{
  "model_version": "xgboost-v1.0.0"
}
```

This enables traceability — any historical prediction can be linked back to the exact model that produced it.

---

## 25. FastAPI Prediction API

### 25.1 Endpoint

```http
POST /api/v1/predict
```

### 25.2 Request Schema

```json
{
  "latitude": 25.5781,
  "longitude": 91.8933,
  "rainfall_1h": 22,
  "rainfall_6h": 61,
  "rainfall_12h": 95,
  "rainfall_24h": 142,
  "rainfall_3d": 285,
  "rainfall_7d": 421,
  "rainfall_30d": 890,
  "soil_moisture": 82,
  "slope": 38,
  "aspect": 180,
  "curvature": -0.02,
  "elevation": 1420,
  "land_cover": "forest",
  "historical_landslides": 4,
  "distance_to_road": 350,
  "distance_to_river": 1200
}
```

### 25.3 Response Schema

```json
{
  "risk_score": 0.87,
  "risk_probability": 0.87,
  "risk_percentage": 87,
  "risk_level": "CRITICAL",
  "model_version": "xgboost-v1.0.0",
  "prediction_timestamp": "2026-08-24T10:30:00Z",
  "contributing_factors": [
    {
      "feature": "rainfall_24h",
      "value": 142,
      "impact": "HIGH",
      "contribution": 0.31
    },
    {
      "feature": "soil_moisture",
      "value": 82,
      "impact": "HIGH",
      "contribution": 0.23
    },
    {
      "feature": "slope",
      "value": 38,
      "impact": "MEDIUM",
      "contribution": 0.18
    },
    {
      "feature": "historical_landslides",
      "value": 4,
      "impact": "MEDIUM",
      "contribution": 0.12
    }
  ]
}
```

### 25.4 Error Response

```json
{
  "detail": [
    {
      "loc": ["body", "latitude"],
      "msg": "Latitude must be between -90 and 90",
      "type": "value_error"
    }
  ]
}
```

---

## 26. Batch Prediction API

### 26.1 Endpoint

```http
POST /api/v1/predict/batch
```

### 26.2 Request Schema

```json
{
  "predictions": [
    {
      "zone_id": "zone_001",
      "latitude": 25.5781,
      "longitude": 91.8933,
      "rainfall_24h": 142,
      "soil_moisture": 82,
      "slope": 38,
      "elevation": 1420,
      "historical_landslides": 4
    },
    {
      "zone_id": "zone_002",
      "latitude": 25.6123,
      "longitude": 91.9145,
      "rainfall_24h": 98,
      "soil_moisture": 67,
      "slope": 25,
      "elevation": 980,
      "historical_landslides": 1
    }
  ]
}
```

### 26.3 Response Schema

```json
{
  "results": [
    {
      "zone_id": "zone_001",
      "risk_score": 0.87,
      "risk_level": "CRITICAL",
      "model_version": "xgboost-v1.0.0"
    },
    {
      "zone_id": "zone_002",
      "risk_score": 0.52,
      "risk_level": "HIGH",
      "model_version": "xgboost-v1.0.0"
    }
  ],
  "prediction_timestamp": "2026-08-24T10:30:00Z",
  "total_predictions": 2,
  "model_version": "xgboost-v1.0.0"
}
```

### 26.4 Optimization Requirements

- The batch API must be optimized for the .NET backend to request predictions for large numbers of risk zones
- Vectorized prediction (not sequential per-row prediction)
- Configurable batch size limits to prevent memory exhaustion
- Partial failure handling — return successful predictions even if some inputs fail validation

---

## 27. Historical Replay API

### 27.1 Design Decision

The historical replay capability may be exposed as:

**Option A — Production API endpoint:**

```http
POST /api/v1/evaluate/replay
```

**Option B — Offline ML evaluation tool only**

### 27.2 Recommendation

> [!IMPORTANT]
> Historical replay should primarily be an **offline ML evaluation tool** used during model development and validation. Exposing it as a production API endpoint is optional and should only be considered if the .NET platform needs to trigger replay evaluations on demand.

### 27.3 Distinction

| Capability | Type | Purpose |
|---|---|---|
| `POST /api/v1/predict` | **Production Prediction** | Real-time risk assessment for current conditions |
| `POST /api/v1/predict/batch` | **Production Prediction** | Batch risk assessment for multiple zones |
| Historical Replay | **Offline Model Evaluation** | Retrospective analysis against known events |

Do not expose unnecessary evaluation functionality in the production service. Keep the production API focused on inference.

---

## 28. Health and Model APIs

### 28.1 Health Check

```http
GET /health
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2026-08-24T10:30:00Z"
}
```

### 28.2 Readiness Check

```http
GET /ready
```

Response:

```json
{
  "status": "ready",
  "model_loaded": true,
  "model_version": "xgboost-v1.0.0",
  "timestamp": "2026-08-24T10:30:00Z"
}
```

The readiness endpoint must return `503 Service Unavailable` if the model is not loaded or the service is not ready to accept predictions.

### 28.3 Model Metadata

```http
GET /api/v1/model
```

Response:

```json
{
  "model_name": "xgboost",
  "model_version": "1.0.0",
  "feature_version": "1.0.0",
  "trained_at": "2026-08-20T10:00:00Z",
  "training_period": "2015-01-01 to 2021-12-31",
  "algorithm": "XGBoost",
  "risk_thresholds": {
    "low": [0.0, 0.3],
    "medium": [0.3, 0.5],
    "high": [0.5, 0.75],
    "critical": [0.75, 1.0]
  }
}
```

---

## 29. Input Validation

### 29.1 Validation Rules

FastAPI/Pydantic must validate all incoming prediction requests:

| Field | Type | Constraints |
|---|---|---|
| `latitude` | `float` | Required. Range: -90 to 90 |
| `longitude` | `float` | Required. Range: -180 to 180 |
| `rainfall_1h` | `float` | Optional. Range: ≥ 0 |
| `rainfall_6h` | `float` | Optional. Range: ≥ 0 |
| `rainfall_12h` | `float` | Optional. Range: ≥ 0 |
| `rainfall_24h` | `float` | Required. Range: ≥ 0 |
| `rainfall_3d` | `float` | Optional. Range: ≥ 0 |
| `rainfall_7d` | `float` | Optional. Range: ≥ 0 |
| `rainfall_30d` | `float` | Optional. Range: ≥ 0 |
| `soil_moisture` | `float` | Required. Range: 0–100 |
| `slope` | `float` | Required. Range: 0–90 |
| `aspect` | `float` | Optional. Range: 0–360 |
| `curvature` | `float` | Optional |
| `elevation` | `float` | Required. Range: ≥ 0 |
| `land_cover` | `string` | Optional. Must be a recognized class |
| `historical_landslides` | `int` | Optional. Range: ≥ 0 |
| `distance_to_road` | `float` | Optional. Range: ≥ 0 |
| `distance_to_river` | `float` | Optional. Range: ≥ 0 |

### 29.2 Error Handling

Invalid requests must return structured HTTP 422 errors with:

- The field that failed validation
- The validation rule that was violated
- A human-readable error message

---

## 30. ML Runtime Architecture

### 30.1 Request Flow

```
.NET Backend
      ↓
FastAPI (HTTP)
      ↓
Request Validation (Pydantic)
      ↓
Feature Transformation (frozen pipeline)
      ↓
Loaded Model (in-memory)
      ↓
Raw Prediction (probability)
      ↓
Calibration (if applicable)
      ↓
Risk Classification (threshold mapping)
      ↓
Explainability (SHAP / feature importance)
      ↓
Response (JSON)
```

### 30.2 Runtime Requirements

| Requirement | Description |
|---|---|
| **Model Loading** | The model must be loaded **once** at application startup and held in memory |
| **No Training at Runtime** | No model training, fine-tuning, or dataset operations during prediction requests |
| **Stateless Predictions** | Each prediction request is independent; no session state |
| **Concurrent Requests** | The service must handle multiple simultaneous prediction requests |
| **Graceful Degradation** | If optional features are missing, the model should still produce predictions (if designed to handle missing data) |

---

## 31. Integration With .NET

### 31.1 Platform Architecture

```
React Frontend / GIS Dashboard
            ↓
.NET Backend (ASP.NET Core)
            ↓
Python FastAPI ML Service
            ↓
ML Model (in-memory)
```

### 31.2 Responsibility Matrix

| Responsibility | Owner |
|---|---|
| Authentication | .NET Backend |
| Authorization | .NET Backend |
| User management | .NET Backend |
| Weather/sensor data ingestion | .NET Backend |
| Business workflows | .NET Backend |
| Risk-zone management | .NET Backend |
| Alert generation (based on ML predictions) | .NET Backend |
| Notifications (SMS, email, push) | .NET Backend |
| Database persistence | .NET Backend |
| Real-time updates (SignalR) | .NET Backend |
| Emergency response workflows | .NET Backend |
| **Feature validation** | **ML Service** |
| **Feature transformation** | **ML Service** |
| **ML inference** | **ML Service** |
| **Probability/risk calculation** | **ML Service** |
| **Explainability** | **ML Service** |
| **Model metadata** | **ML Service** |

### 31.3 Integration Contract

The .NET backend communicates with the ML service via:

- **Protocol:** HTTP/REST
- **Format:** JSON
- **API Version:** `/api/v1/`
- **Authentication:** Internal network trust (or API key if deployed separately)

The API contract (request/response schemas) is the **integration boundary**. Changes to the ML model internals must not break this contract.

---

## 32. Production Project Structure

```
ner-landslide-ml/
│
├── app/                           # FastAPI application
│   ├── __init__.py
│   ├── main.py                    # Application entry point
│   ├── api/                       # API route handlers
│   │   ├── __init__.py
│   │   ├── predict.py             # /api/v1/predict
│   │   ├── batch.py               # /api/v1/predict/batch
│   │   ├── model_info.py          # /api/v1/model
│   │   └── health.py              # /health, /ready
│   ├── schemas/                   # Pydantic models
│   │   ├── __init__.py
│   │   ├── prediction.py          # Request/response schemas
│   │   └── model_info.py          # Model metadata schemas
│   ├── services/                  # Business logic
│   │   ├── __init__.py
│   │   ├── prediction_service.py  # Prediction orchestration
│   │   ├── risk_classifier.py     # Risk-level classification
│   │   └── explainability.py      # SHAP / feature importance
│   ├── ml/                        # ML model management
│   │   ├── __init__.py
│   │   ├── model_loader.py        # Model loading and caching
│   │   ├── feature_pipeline.py    # Feature transformation
│   │   └── calibration.py         # Probability calibration
│   └── core/                      # Configuration and utilities
│       ├── __init__.py
│       ├── config.py              # Application settings
│       └── logging.py             # Structured logging
│
├── training/                      # Offline training pipeline
│   ├── notebooks/                 # Exploratory data analysis
│   ├── preprocessing/             # Data cleaning and preparation
│   │   ├── __init__.py
│   │   ├── data_loader.py
│   │   ├── data_cleaner.py
│   │   └── data_integrator.py
│   ├── feature_engineering/       # Feature computation
│   │   ├── __init__.py
│   │   ├── rainfall_features.py
│   │   ├── terrain_features.py
│   │   ├── historical_features.py
│   │   └── geographic_features.py
│   ├── train.py                   # Model training script
│   ├── evaluate.py                # Model evaluation script
│   ├── replay.py                  # Historical replay evaluation
│   ├── calibrate.py               # Probability calibration
│   ├── stress_test.py             # Stress/edge-case testing
│   └── export_model.py            # Model artifact export
│
├── evaluation/                    # Evaluation outputs
│   ├── reports/                   # Validation reports
│   ├── plots/                     # Visualization outputs
│   └── results/                   # Metric results (JSON/CSV)
│
├── data/                          # Data directory
│   ├── raw/                       # Unprocessed source data
│   ├── interim/                   # Intermediate processing
│   └── processed/                 # Final training-ready data
│
├── models/                        # Frozen model artifacts
│   └── xgboost-v1.0.0/
│       ├── model.joblib
│       ├── feature_pipeline.joblib
│       ├── calibrator.joblib
│       ├── metadata.json
│       └── validation_report.md
│
├── tests/                         # Test suite
│   ├── unit/                      # Unit tests
│   ├── integration/               # API integration tests
│   └── ml/                        # ML evaluation tests
│
├── Dockerfile                     # Container build
├── docker-compose.yml             # Local development
├── pyproject.toml                 # Project configuration
├── requirements.txt               # Python dependencies
├── requirements-dev.txt           # Development dependencies
└── README.md                      # Project documentation
```

---

## 33. Testing Strategy

### 33.1 Unit Testing

Test the correctness of individual components:

| Component | Tests |
|---|---|
| **Feature Transformations** | Verify scaling, encoding, derivation produce expected outputs |
| **Risk Classification** | Verify threshold mapping (score → risk level) |
| **Input Validation** | Verify Pydantic schemas reject invalid inputs |
| **Model Loading** | Verify model loads from artifact, handles missing files |
| **API Schemas** | Verify request/response serialization |
| **Error Handling** | Verify structured error responses for edge cases |

### 33.2 ML Evaluation Testing

Test model quality and scientific validity:

| Test Category | Tests |
|---|---|
| **Model Metrics** | Precision, recall, F1, ROC-AUC, PR-AUC meet thresholds |
| **Temporal Validation** | Performance on time-split test set |
| **Geographic Validation** | Performance on held-out regions |
| **Calibration** | Brier score, calibration curve analysis |
| **Historical Replay** | Replay results across known events |
| **Stress Conditions** | Extreme inputs produce sensible predictions |
| **Missing Data** | Model handles absent features appropriately |
| **False Positives** | False-positive rate within acceptable bounds |
| **False Negatives** | False-negative rate within acceptable bounds |

### 33.3 API Integration Testing

Test the full prediction pipeline end-to-end:

```
Test Client (HTTPX)
       ↓
FastAPI Application
       ↓
Model Inference
       ↓
Prediction Response
       ↓
Assertions
```

| Test | Verification |
|---|---|
| **Valid prediction request** | Returns 200 with expected schema |
| **Batch prediction request** | Returns 200 with multiple results |
| **Invalid input** | Returns 422 with structured errors |
| **Health endpoint** | Returns 200 with healthy status |
| **Ready endpoint** | Returns 200 when model is loaded |
| **Model metadata** | Returns correct version and configuration |
| **API contract stability** | Response schema matches documented contract |

---

## 34. Performance Requirements

### 34.1 Initial Targets

| Metric | Target |
|---|---|
| **Single prediction latency** | < 500 ms (excluding external network latency) |
| **Batch prediction** | Must support hundreds to thousands of zones per request |
| **Model loading** | Once at startup; held in memory |
| **Training during prediction** | Prohibited |
| **Concurrent requests** | Supported (async FastAPI + Uvicorn workers) |

### 34.2 Scalability

- The service should be **horizontally scalable** — deploying additional container instances behind a load balancer
- Each instance loads the same frozen model artifact
- No shared mutable state between instances
- Stateless prediction requests enable linear scaling

---

## 35. Observability

### 35.1 Metrics

| Metric | Description |
|---|---|
| **Prediction Count** | Total predictions served (single + batch) |
| **Prediction Latency** | P50, P95, P99 response times |
| **API Error Rate** | Rate of 4xx and 5xx responses |
| **Risk-Level Distribution** | Count of predictions per risk level (LOW, MEDIUM, HIGH, CRITICAL) |
| **Model Version Usage** | Track which model version is serving predictions |

### 35.2 Structured Logging

Each prediction request should log:

| Field | Description |
|---|---|
| `request_id` | Unique identifier for the request |
| `timestamp` | When the request was processed |
| `model_version` | Model version used for prediction |
| `processing_time_ms` | Time taken to process the request |
| `risk_level` | Predicted risk level |
| `error` | Error details (if applicable) |

### 35.3 Privacy

> [!NOTE]
> Do not log sensitive information unnecessarily. Prediction inputs may contain geographic coordinates that, combined with timestamps, could identify specific communities. Log what is needed for debugging and monitoring; minimize retention of detailed input data.

---

## 36. Future ML Capabilities

The architecture should be designed to accommodate future model capabilities. These should be introduced as **separate model endpoints or services** rather than overloading the initial model.

### 36.1 Satellite Imagery Analysis

```
Satellite Image (Sentinel-1/2)
        ↓
Computer Vision Model (CNN)
        ↓
Surface Change Score
        ↓
Integration with Risk Model
```

**Use case:** Detecting surface deformation, vegetation loss, or terrain changes that precede landslides.

### 36.2 Field Image Analysis

```
Uploaded Photo (field team)
        ↓
Computer Vision Model
        ↓
Crack / Slope Movement Detection
        ↓
Risk Factor Input
```

**Use case:** Field teams upload photographs of hillslopes; CV model identifies visual precursors (cracks, bulging, seepage).

### 36.3 Time-Series Forecasting

```
Rainfall History
+
Soil Moisture History
+
Terrain (static)
        ↓
Time-Series Model (LSTM / Transformer)
        ↓
Future Risk Forecast
```

**Use case:** Predict risk not just for current conditions, but for the next 24–72 hours based on temporal patterns.

> [!NOTE]
> These capabilities should be introduced incrementally. The initial model must be validated and deployed before adding complexity. Each future capability should follow the same rigorous validation framework defined in this PRD.

---

## 37. Critical Product Principles

### Principle 1 — Model Quality Before Application Integration

The ML model must be **validated before** the .NET and React layers depend on it. Integrating an unvalidated model creates a false sense of operational readiness.

### Principle 2 — Historical Evidence

Model performance must be evaluated against **historical events where actual outcomes are known**. A model that cannot retrodict known landslides has no basis for predicting future ones.

### Principle 3 — No Data Leakage

The model must only use information **available at prediction time**. Any leakage of future information invalidates the entire evaluation.

### Principle 4 — Accuracy Is Not Enough

**Precision, recall, F1, PR-AUC, calibration, and false-negative analysis** are all required. Accuracy alone is misleading on imbalanced datasets.

### Principle 5 — NER Relevance

Global datasets can help develop the system, but **NER-specific data must be prioritized** for final evaluation. A model trained on global data may not capture the unique geological, climatological, and land-use conditions of Northeast India.

### Principle 6 — Explainability

Every high-risk prediction should provide **understandable contributing factors**. Decision-makers need to know *why* the model predicts high risk, not just *that* it does.

### Principle 7 — Decision Support

The model **predicts risk; it does not make autonomous disaster-management decisions**. Final decisions about warnings, evacuations, and resource deployment remain with human authorities.

### Principle 8 — Reproducibility

The same dataset, feature pipeline, and model version should **reproduce the same prediction**. Non-determinism in predictions undermines trust and makes debugging impossible.

---

## 38. Definition of Done

The ML Engine MVP is complete **only** when all of the following are verified:

### Data

- [ ] Open-source datasets collected
- [ ] Dataset licenses documented
- [ ] NER data identified and prioritized
- [ ] Raw data versioned
- [ ] Data cleaning pipeline implemented
- [ ] Feature engineering pipeline implemented
- [ ] Training labels generated
- [ ] Data leakage checks implemented

### Model Development

- [ ] Baseline model trained
- [ ] Logistic Regression evaluated
- [ ] Random Forest evaluated
- [ ] XGBoost evaluated
- [ ] Final model selected using objective criteria

### Validation

- [ ] Temporal test completed
- [ ] Geographic validation performed (where possible)
- [ ] Precision measured
- [ ] Recall measured
- [ ] F1 measured
- [ ] ROC-AUC measured
- [ ] PR-AUC measured
- [ ] Confusion matrix analyzed
- [ ] False negatives analyzed
- [ ] False positives analyzed
- [ ] Calibration evaluated
- [ ] Risk thresholds evaluated
- [ ] Historical replay completed
- [ ] Stress testing completed
- [ ] Missing-data testing completed
- [ ] Explainability implemented and reviewed
- [ ] Validation report generated

### Production Readiness

- [ ] Model version frozen
- [ ] FastAPI prediction API implemented
- [ ] Batch prediction API implemented
- [ ] Health/readiness endpoints implemented
- [ ] Model metadata endpoint implemented
- [ ] Input validation implemented
- [ ] Automated tests implemented (unit + integration + ML)
- [ ] Docker deployment implemented
- [ ] .NET integration contract defined and documented

---

> [!CAUTION]
> The final output of the project must be a **validated and versioned ML model exposed through a stable FastAPI inference service**, ready for integration with the .NET backend. Do not move to full backend/frontend integration merely because the model produces predictions. Move to integration **only after** the model has passed all defined validation and acceptance criteria.

---

*End of Product Requirements Document*
