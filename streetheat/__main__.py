import numpy as np 
import matplotlib as mpl        
import matplotlib.pyplot as plt 
import cartopy.crs as ccrs
import cartopy.io.img_tiles as cimgt

request = cimgt.OSM()
fig, ax = plt.subplots(figsize=(10,16),
                       subplot_kw=dict(projection=request.crs))
point_up = (59.445424, 17.726427)
point_down = (59.238850, 18.290799)
extent = [point_down[1], point_up[1], point_down[0], point_up[0]] 
         # (xmin, xmax, ymin, ymax)
ax.set_extent(extent)
ax.add_image(request, 8)

# generate (x, y) centering at (extent[0], extent[2])
x = extent[0] + np.random.randn(1000)
y = extent[2] + np.random.randn(1000)

# do coordinate conversion of (x,y)
xynps = ax.projection.transform_points(ccrs.Geodetic(), x, y)

# make a 2D histogram
h = ax.hist2d(xynps[:,0], xynps[:,1], bins=40, zorder=10, alpha=0.5)
#h: (counts, xedges, yedges, image)

cbar = plt.colorbar(h[3], ax=ax, shrink=0.45, format='%.1f')  # h[3]: image

plt.show()