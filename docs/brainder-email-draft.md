# Email draft for Brainder.org / Anderson Winkler

**To:** Anderson M. Winkler (brainder.org contact)
**Subject:** Web pipeline + React viewer built on your Brain for Blender meshes (CC BY-SA 3.0)

---

Hi Anderson,

I hope this message finds you well. I wanted to reach out about a project I've built using your excellent "Brain for Blender" mesh data (the Desikan-Killiany OBJ archives).

I've created an open-source toolkit that brings your atlas meshes to the web browser:

**Repository:** https://github.com/mpatricny/brain-for-web

It consists of two packages:

1. **`freesurfer-to-glb`** -- A Node.js CLI tool and library that downloads your DK atlas OBJ archives, merges parcels into functionally meaningful brain regions (e.g., combining `lh.rostralmiddlefrontal` + `lh.caudalmiddlefrontal` into a single dlPFC mesh), normalizes coordinates, deduplicates vertices, and exports an optimized binary glTF 2.0 (GLB) file. It includes a hand-written GLB builder that runs entirely in Node.js with no browser dependencies. Custom region maps are supported via JSON config.

2. **`react-brain-atlas`** -- An interactive React + Three.js viewer component that renders the GLB atlas with features like bilateral mirroring (store only left-hemisphere meshes, mirror at render time to halve file size), an explode view with centroid-based animation, color by theme or neural system, camera fly-to on region selection, and educational info panels with scientific citations.

The project is licensed under Apache 2.0 for the code, while the mesh data and generated GLB files remain CC BY-SA 3.0 matching your original license. Full attribution to your work and Brainder.org throughout.

I'm reaching out for two reasons:

1. **Visibility** -- Would you be interested in linking to this project from your Brain for Blender page? I think web accessibility could bring your atlas data to a broader audience (educators, students, science communicators) who may not use Blender.

2. **Contribution** -- If you maintain a list of community tools or derivatives, I'd be happy to submit a pull request or provide whatever format works best for your site.

Thank you for making the atlas data freely available -- it's been a fantastic foundation to build on.

Best regards,
Martin Patricny
mpatricny@proton.me
