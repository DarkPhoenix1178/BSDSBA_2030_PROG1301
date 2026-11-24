# Water Ripples Without a Sine Wave

A grid-based water surface that produces ripples through a finite-difference form of the wave equation. No trigonometric function is used to generate the waves, and the notebook proves it at runtime by disabling `numpy`'s trig functions and running the simulation anyway.

This is the LT 1 & 2 entry for the PROG1301 credit-key task.

## Run it

```bash
pip install -r requirements.txt
jupyter lab ripples.ipynb
```

Everything runs top to bottom in about fifteen seconds. The interactive panel needs `ipywidgets`, which ships with JupyterLab and Colab. If it is missing, that cell falls back to a scripted run and tells you the install line.

## The model

The surface is a grid of heights. Each step, every cell is updated from its own last two heights and the current heights of its four neighbours:

```
u_next = (2u - (1 - gamma) * u_prev + C^2 * laplacian(u)) / (1 + gamma)
```

`C = c dt / dx` is the wave speed in cells per step and is held below `1/sqrt(2)` for stability. `gamma` is a per-cell loss coefficient: a small uniform value everywhere, plus a stronger band at the rim that absorbs outgoing rings.

The initial condition is a volume-conserving crater, a Gaussian depression with a compensating raised rim. That matters. A simple bump leaves a permanent raised patch in the middle and looks like a spreading disc rather than a ripple.

## What the notebook shows

| Experiment | Result |
|---|---|
| Trig audit | 250 steps with `numpy.sin`, `cos` and `tan` replaced by raising functions: no call |
| Front speed | 0.5 cells per step at `C = 0.5`, as set |
| Interference | two coherent craters produce four sign changes across the midline between them |
| Amplitude falloff | fitted log-log slope -0.509 against the -0.5 predicted by 2D geometric spreading |
| Damping | energy decays exponentially, straight line on a log axis |
| Boundary | hard wall retains 98.3% of the energy after 280 steps, absorbing rim retains 8.5% |

## Files

- `ripples.ipynb` - the simulation, the experiments, and the interactive panel
- `requirements.txt` - three packages, one of them optional

## Known limits

The model is linear, so no breaking waves or wind. It is a single height field, not a full 3D fluid. The five-point stencil is slightly anisotropic, which makes a very long-running ring square off slowly. The absorbing rim is good, not perfect: about 8% of the energy reflects or lingers.
