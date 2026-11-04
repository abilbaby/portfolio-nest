# ASSET GUIDE — ABIL K BABY PORTFOLIO
## Cool White × Midnight Navy × Vermilion × Glacial Ice Blue System

> This guide documents every visual asset, dimensions, aspect ratios, and simple replacement steps for the portfolio.

---

## 1. PROFILE PHOTOGRAPHY

| Asset | Path | Format | Aspect Ratio | Dimensions | Purpose |
|---|---|---|---|---|---|
| Main Portrait | `assets/images/profile/abi.jpeg` | JPEG / WebP | ~0.82 (5:6) | 440×530px min | Hero section portrait |

### Replacement Procedure
1. Crop your new portrait image to a 5:6 vertical ratio (e.g. 880×1060px for retina displays).
2. Save it as `abi.jpeg` inside `assets/images/profile/`.
3. The CSS utilizes `object-fit: cover` with `object-position: top center` inside the layered glassmorphism frame.
4. No markup changes are necessary if the filename is retained.

---

## 2. PROJECT COVER IMAGES

> Exactly **one** cover image is used per project presentation. No fictional multi-image carousels or mockups.

| Project | Image Path | Status | Aspect Ratio | Minimum Size |
|---|---|---|---|---|
| **01. ORDON** | `assets/images/projects/ordon.png` | ✅ Present | 16:10 / 3:2 | 720×480px |
| **02. Child Vaccination System** | `assets/images/projects/vaccine.png` | ✅ Present | 16:10 / 3:2 | 720×480px |
| **03. Freelance Frontend** | `assets/images/projects/homeegram.png` | ✅ Present | 16:10 / 3:2 | 720×480px |

### Replacement Procedure
1. Save high-resolution screenshots or interface covers (recommended: 1440×960px).
2. Save directly into `assets/images/projects/` matching the paths above.
3. If using `.webp`, update the `src` attribute in [`index.html`](file:///e:/portifoli/index.html).

---

## 3. CERTIFICATION ASSETS & EVIDENCE

| Certification | Document Evidence Path | Status |
|---|---|---|
| Front-End Application Development using Angular (NeST Digital) | `assets/documents/Internship.pdf` | ✅ Linked & verified |
| AI in Cybersecurity (NeST Digital Academy) | — | Editorial card |
| DevOps: The Essentials (NeST Digital Academy) | — | Editorial card |
| AI: Concepts and Techniques (NPTEL SWAYAM) | `assets/documents/nptel_certificate.pdf` | ✅ Linked & verified |
| Artificial Intelligence Fundamentals (IBM SkillsBuild) | — | Editorial card |

---

## 4. COLOR CODES REFERENCE

```css
--clr-bg:        #F4F6F8; /* 50% Cool White main canvas */
--clr-card:      #FFFFFF; /* Pure White cards & surfaces */
--clr-navy:      #172333; /* 20% Midnight Navy typography & dark surfaces */
--clr-slate:     #344D68; /* Slate Blue secondary surfaces */
--clr-vermilion: #E45B42; /* 15% Vermilion primary accent & identity */
--clr-ice-blue:  #A0C0D0; /* 10% Glacial Ice Blue glassmorphism & depth */
--clr-mist-grey: #D5DEE7; /* 5% Mist Grey borders & supporting lines */
```

*Last updated: November 2026*
