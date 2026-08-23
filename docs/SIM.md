# Wie man eine Erde per Laser zerstört

CINDER nimmt **kein Voxel-Minecraft** und kein volles FEM. Es nimmt ein Modell, das auf einer Kugel echt aussieht und in 60fps bleibt.

## Was der Prototyp tut

1. **Ray gegen Kugel** — der Cursor trifft die Mesh-UV der Erde (dieselbe Karte wie die Textur).
2. **Equirectangular Damage-Map** (1024×512, RGBA):
   - R = Krater / ablatierte Masse
   - G = Hitze
   - B = Risse
3. **Energie, nicht Bool.** Jeder Frame, den der Strahl hält, splattet eine Gauß-Kerbe. Hitze steigt. Erst über einer Verdampfungsschwelle wird aus überschüssiger Energie Krater-Tiefe. Deshalb sieht der erste Kontakt nach Versengung aus, nicht nach sofortigem Loch.
4. **Dwell weitet die Pfanne.** Der Splat-Radius skaliert mit lokaler Hitze und Tiefe — der Strahl frisst sich breiter, wenn man stehen bleibt.
5. **Abkühlung.** G klingt exponentiell ab, R bleibt. Magma dunkelt, der Krater bleibt.
6. **Vertex-Displacement** liest R, die Kruste sackt ein. Der Fragment-Shader mischt Kruste → Ruß → Magma → glühenden Kern und lässt Wolken über der Wunde verschwinden.

## Andere Modelle (für später)

| Idee | Wirkung | Kosten |
| --- | --- | --- |
| **Nur Decals** | Schnell, flach, kein Silhouetten-Krater | zu billig |
| **Diese Heat-Map (jetzt)** | Glaubwürdige Progression, GPU-freundlich | Prototype-sweet-spot |
| **SDF / CSG** | Echte Löcher durch den Planeten, Innenraum | teurer, andere Silhouette |
| **Voxel / marching cubes** | Brocken brechen raus | zu grob oder zu schwer |
| **Höhe + Thermik + Festigkeit** | Risse, Platten, Kollaps | Vollspiel, nicht Prototyp |
| **Atmosphären-Strip** | Sekundäre Zerstörung | Shader + Partikel |

Der nächste grafische Schritt nach diesem Prototyp wäre: Brocken (instanced crust chips) sobald R über einer Schwelle und ein Nachbar viel niedriger ist — strukturelles Versagen, nicht nur Schmelze.
