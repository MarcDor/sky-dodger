# Cinder 2D

Kein 3D-Globus. Der Planet ist eine Scheibe auf einem Canvas.

Zerstörung ist **destruktiv**, nicht ein Decal: beim Treffer werden die Pixel kopiert (Brocken), dann wird ein unregelmäßiges Loch gestanzt (`destination-out`). Die Brocken fliegen mit derselben Farbe weg. Wackeln sitzt auf der ganzen Szene, plus ein kurzer Hit-Stop.

Wunde ≈ gestanzte Fläche / Scheibenfläche. Gold = Einkommen × UFO-Anzahl + ein bisschen pro Schuss.
