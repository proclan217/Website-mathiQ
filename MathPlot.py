import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from matplotlib.collections import LineCollection

# Set up the figure and axis
fig, ax = plt.subplots(figsize=(10, 6))
ax.set_xlim(0, 2*np.pi)
ax.set_ylim(-1.5, 1.5)
ax.set_facecolor('black')
fig.set_facecolor('black')
ax.set_xticks([])
ax.set_yticks([])
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['bottom'].set_visible(False)
ax.spines['left'].set_visible(False)

# Create the initial sine wave
x = np.linspace(0, 2*np.pi, 1000)
y = np.sin(x)
line, = ax.plot(x, y, 'w', alpha=0.3, lw=2)

# Create the moving dot
dot, = ax.plot([], [], 'o', color='cyan', markersize=10)

# Create a line collection for the trail
trail_segments = []
trail = LineCollection(trail_segments, colors='cyan', linewidths=2)
ax.add_collection(trail)

# Initialize trail data
trail_x = []
trail_y = []

# Animation update function
def update(frame):
    # Calculate current position
    current_x = frame * 2*np.pi / 100
    current_y = np.sin(current_x)
    
    # Update dot position
    dot.set_data([current_x], [current_y])
    
    # Update trail
    trail_x.append(current_x)
    trail_y.append(current_y)
    
    # Keep only the last 20 points for the trail
    if len(trail_x) > 20:
        trail_x.pop(0)
        trail_y.pop(0)
    
    # Create segments for the trail
    segments = []
    for i in range(len(trail_x)-1):
        segments.append([(trail_x[i], trail_y[i]), (trail_x[i+1], trail_y[i+1])])
    
    trail.set_segments(segments)
    
    # Fade out the trail by reducing alpha
    alphas = np.linspace(0.1, 1, len(segments))
    colors = [(0, 1, 1, alpha) for alpha in alphas]
    trail.set_color(colors)
    
    return dot, trail

# Create the animation
ani = FuncAnimation(fig, update, frames=100, interval=50, blit=True)

plt.tight_layout()
plt.show()
ani.save('sine_wave_trail.mp4', writer='ffmpeg', fps=30, dpi=300)