# SF Bay Sediment Microplastic Analysis

Geospatial analysis examining relationships between sediment microplastic concentrations and co-contaminants (PCBs, PAHs, metals) in the San Francisco Bay watershed, developed as part of master's thesis research at Virginia Commonwealth University (2026).

Satellite-derived turbidity (NDTI) from Sentinel-2 imagery is evaluated as a potential proxy for microplastic concentration using temporal matching methods across multiple time windows.

---

## Files

### `sfbay_ndti.js`
Google Earth Engine script extracting Sentinel-2 NDTI values across San Francisco Bay (2017–2018). Includes cloud masking, turbidity index calculation, median compositing, and GeoTIFF export.

### `sfbay_sediment_analysis.qmd`
Quarto/R analysis pipeline with four parts:

- **Part 1** — Spatial join between sediment microplastic and chemistry sites; Spearman correlations and linear models for PCBs, PAHs, pesticides, and metals totals
- **Part 2** — Individual metals analysis using nearest-site matching within 5 km; ranked correlation plot with p-values
- **Part 3** — Contaminant family-level analysis (PCBs, PAHs, pesticides, metals) with p-values
- **Part 4** — NDTI temporal matching sensitivity analysis comparing nearest-image, 3-day, 7-day, and 30-day window strategies

---

## Input files

| File | Description |
|------|-------------|
| `sediment_plastic_spatial_master_clean.csv` | Sediment microplastic concentrations with coordinates |
| `sediment_chemistry_spatial_master_clean.csv` | Sediment chemistry totals (PCBs, PAHs, pesticides, metals) |
| `full_sediment_specific_metals_wide.csv` | Individual metal concentrations in wide format |
| `full_sediment_chemistry_network_clean.csv` | Full chemistry network for family-level analysis |
| `NDTIpoints_baywide_long_with_satellite_coords.csv` | Long-format NDTI values matched to sediment sampling sites |

Data sources: San Francisco Estuary Institute (SFEI) Regional Monitoring Program.

---

## Requirements

R 4.3+ with the following packages: `tidyverse`, `sf`, `janitor`, `lubridate`, `forcats`, `scales`, `purrr`

Place all input CSV files in the same directory as the `.qmd` file before running.
