import os
import sys
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def generate_metrics_chart():
    # Benchmark datasets & labels
    categories = [
        'VQA Accuracy\n(RSVQA Baseline)',
        'Grounding IoU\n(VRSBench Grounding)',
        'Change F1-Score\n(CDVQA Bi-Temporal)',
        'Sensor Alignment\n(BigEarthNet Optical-SAR)'
    ]
    
    generic_vlm = [52.4, 41.2, 48.7, 34.5]
    satquery_ai = [86.8, 81.5, 84.3, 89.1]
    
    x = np.arange(len(categories))
    width = 0.35
    
    # Create figure with dark space-navy aesthetic
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=300)
    fig.patch.set_facecolor('#020617')
    ax.set_facecolor('#020617')
    
    # Grid styling
    ax.grid(axis='y', linestyle='--', alpha=0.15, color='#38bdf8', zorder=0)
    
    # Bars
    bars1 = ax.bar(x - width/2, generic_vlm, width, label='Generic VLM Baseline (Unadapted)', 
                   color='#5a6b82', edgecolor='#1e293b', linewidth=1.2, zorder=3, alpha=0.9)
    bars2 = ax.bar(x + width/2, satquery_ai, width, label='SatQuery AI (Fine-Tuned / Adapted)', 
                   color='#10b981', edgecolor='#059669', linewidth=1.2, zorder=3)
    
    # Value labels on top of bars
    def autolabel(rects, is_highlight=False):
        for rect in rects:
            height = rect.get_height()
            fontweight = 'bold' if is_highlight else 'normal'
            ax.annotate(f'{height:.1f}%',
                        xy=(rect.get_x() + rect.get_width() / 2, height),
                        xytext=(0, 5),
                        textcoords="offset points",
                        ha='center', va='bottom',
                        color='#ffffff' if is_highlight else '#e2e8f0',
                        fontsize=9.5, fontweight=fontweight)
            
    autolabel(bars1, False)
    autolabel(bars2, True)
    
    # Title & Axis labels
    ax.set_title('REMOTE SENSING REPRESENTATION DOMAIN ADAPTATION METRICS', 
                 fontsize=13, fontweight='bold', color='#ffffff', pad=20, fontfamily='sans-serif')
    ax.set_ylabel('Model Evaluation Performance (%)', fontsize=10.5, color='#94a3b8', labelpad=12)
    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=9.5, color='#cbd5e1')
    ax.set_ylim(0, 110)
    
    # Ticks & spines styling
    ax.tick_params(axis='y', colors='#94a3b8', labelsize=9.5)
    ax.tick_params(axis='x', colors='#94a3b8', length=0)
    
    for spine in ['top', 'right', 'left']:
        ax.spines[spine].set_visible(False)
    ax.spines['bottom'].set_color('#f59e0b')
    ax.spines['bottom'].set_linewidth(1.5)
    
    # Legend
    legend = ax.legend(loc='upper left', frameon=True, facecolor='#0f172a', edgecolor='#1e293b', 
                       fontsize=9.5, labelcolor='#e2e8f0')
    legend.get_frame().set_alpha(0.85)
    
    plt.tight_layout()
    
    # Output paths
    output_dir_backend = os.path.join(os.path.dirname(__file__), 'static', 'images')
    output_dir_frontend = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public'))
    
    os.makedirs(output_dir_backend, exist_ok=True)
    os.makedirs(output_dir_frontend, exist_ok=True)
    
    path_backend = os.path.join(output_dir_backend, 'metrics_comparison.png')
    path_frontend = os.path.join(output_dir_frontend, 'metrics_comparison.png')
    
    plt.savefig(path_backend, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.savefig(path_frontend, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()
    
    print(f"[PASS] Chart saved to:\n  - {path_backend}\n  - {path_frontend}")
    return path_backend

if __name__ == '__main__':
    generate_metrics_chart()
