# Sprite Positioning Guide

## Fixed Alignment Issue

### Problem:
- Player and bull were not aligned on the same ground level
- Ground was at `height - 10` but sprites were at `height - 60`

### Solution:
Proper mathematical positioning based on ground and sprite dimensions:

```
Screen Height: 720px
Ground Height: 40px
Ground Y Position: height - (groundHeight / 2) = 720 - 20 = 700px
Ground Top: height - groundHeight = 720 - 40 = 680px

Player/Bull Positioning:
- Collision Box Height: 50px
- Scale: 1.5x
- Scaled Height: 50 * 1.5 = 75px
- Y Position: groundTop - (scaledHeight / 2) = 680 - 37.5 = 642.5px
```

### Visual Layout:
```
┌─────────────────────────────────────┐ ← 0px (top)
│                                     │
│           GAME AREA                 │
│                                     │
│                                     │
│     👤 Player    🐂 Bull            │ ← ~642px (sprite centers)
├─────────────────────────────────────┤ ← 680px (ground top)
│           GROUND PLATFORM           │ ← 40px thick
└─────────────────────────────────────┘ ← 720px (bottom)
```

### Key Changes:
1. **Ground positioning**: Centered at `height - (groundHeight / 2)`
2. **Sprite positioning**: Calculated based on ground top minus half of scaled sprite height
3. **Consistent scaling**: Both player and bull use same scale (1.5x)
4. **Proper collision boxes**: Set to match visual appearance

### Result:
- ✅ Player and bull are now on the same horizontal line
- ✅ Both sprites sit properly on the ground platform
- ✅ Collision detection works correctly
- ✅ Physics gravity pulls them to the correct ground level
