# Mosh Pit Simulation

# Minimal Viable Product

A simulation of a human “mosh pit.” 

## Tech Stack

- Python

Modules

- Pygame
Visualization
- Pymunk 
Calculates the Physics
- Numpy
Efficient Code

# Context

A mosh pit is a crowd movement pattern at energetic concerts where people move, bump, and change direction quickly. Two common forms usually take place:

- Mosh pit: People move in many directions and collide randomly, a bit like particles in a gas.
- Circle pit: People collectively move around an open center, forming a large rotating loop.

Vicsek-like model was used to simplify the dynamics of each human mosher to a simple soft-bodied particle, dubbed as a Mobile Active Simulated Humanoid - MASHer (SI).

- Active MASHers
    - Self-propelled
    - Experience flocking interactions
    - Subject to random fluctuations in the forces they experience
- Passive MASHers
    - Prefer to remain stationary
    - Not subject to flocking interactions or random forces

Though both are uniformly mixed, it is found that with sufficient time, the flocking-interaction leads to a spontaneous phase separation with a dense population of active MASHers confined by passive MASHers

Results demonstrate how a non-equilibrium system can have equilibrium characteristics: random motions over a sufficient time reproduce the statistics of classical gasses via the Central Limit Theorem.

### Behavior Dynamics of Each MASHer

$$
change\ in\ motion=avoidance+self\text{-}propulsion+following+randomness
$$

- Active MASHers
    - $v_0=1,\alpha$ varies over the interval $[0,5]$, and the std of the components of $\eta_i$ varies of the interval $[0,3]$
- Passive MASHers
    - $v_0=\alpha=\eta_i=0$
    - By varying the magnitude of the flocking coefficient and the strength of the noise for active MASHers, the phase diagram is investigated.

![image.png](image.png)

#### Hertzian Soft Body Repulsion

Push-like effect on their movement. If two ppl are far enough apart, the effect is 0. If they get too close, the model pushes them apart. The exponent 5/2 is simple a design choice that makes the push become stronger smoothly as bodies overlap. 

$$
\vec F^\text{repulsion} =
\begin{cases}
\epsilon\left(1-\frac{r_{ij}}{2r_0}\right)^{5/2}\hat r_{ij}, & r_{ij}<2r_0\\
0, & \text{otherwise}
\end{cases}

$$

- $r_{ij}$ = center-to-center distance between MASHer $i$ and $j$
- $r_0$ = MASHer radius
- $2r_0$ = the distance where two people begin touching

#### Self-propulsion

If someone is moving slower than their preferred speed, this term encourages them to speed up, too fast and it encourages slowing down. 

$$
\vec F^\text{propulsion} = \mu(v_0-v_i)\hat v_i
$$

- $v_0$ = preferred speed
- $v_i$ = instantaneous speed (current speed)
- $\mu$ = how quickly they correct their speed
- $\hat v_i$ = their current direction

#### Flocking Interactions

Summation of the velocities $v_j$ of all the $N_i$ MASHERS within a radius $r_{flock}$ of MASHer $i$. 

$$

\vec F_i^{\text{flocking}}
=
\alpha
\frac{\sum_{j=1}^{N_i}\vec v_j}
{\left|\sum_{j=1}^{N_i}\vec v_j\right|}

$$

This term looks at the velocities of nearby people. If this effect is strong, people nearby align their movement. Than can produce a circle pit, where many people end up circulating around the center in the same direction.

#### Gaussian random noise

$$
\vec F_i^{\text{noise}} = \vec \eta_i

$$

The model adds random small pushes called noise. This represents spontaneous decisions, uneven bumps, rhythm, distractions, and all other unpredictable parts of a real crowd. 

- Components are drawn from a Gaussian distribution with zero mean and whose std was varied in the simulation.

### Measured Outcomes (Results)

| Measured Outcome | What it means |
| --- | --- |
| **Crowd pattern / phase** | Does the crowd look like a random mosh pit (“gas”) or an organized rotating circle pit (“vortex”)? |
| **Angular momentum** | A number that detects collective rotation. Near zero means no shared rotation; a large value means a circle pit. |
| **Speed distribution** 
Equilibrium Speed Distribution of Classical 2D gasses (Maxwell-Boltzmann Distribution) | How many people move slowly, moderately, or quickly. The paper compares this with the distribution expected for gas particles. |
| **Velocity correlation** | Whether people near each other tend to move in similar directions. |
| **Effective temperature** | A measure of how energetic and varied the crowd’s motion is—not actual heat. |
| **Radial temperature pattern, $(T(r))$** | Whether motion differs between the center and the edge of the simulated pit. |

### Set-Up

- Initially, the active MASHers are situated in a circle centered in the middle of the simulation box. This choice of initial positions is a choice of convenience: any non-zero flocking force causes MASHers to self-segregate when started with random initial positions, though this tends to have a large times (~$10^3\times(r_0/v_0)$ time steps) when $r_{flock}/r_0=O(1)$.
- Once formed, simulated mosh and circle pits typically last for times greater than $10^5\times(r_0/v_0)$ time steps, and can switch directions at random intervals [24].
- The simulation box is of length $L=1.03\sqrt{\pi}r^2_0N\approx40.8$ to give a packing fraction $\rho=0.94$, and is periodic on both sides to avoid boundary effects.
- The Newton-Stomer-Verlet integration algorithm and cell based neighbor lists are used to expedite computation.
- The phase diagram shown is comprised of $2\times10^6$ individual simulations sampled on 10,000 grid points.
- For each run, the angular momentum is measured about the center of mass $x_{cm}=(L/2\pi)arctan(Im(A)/Re(A))$, where $A=\sum^{N_{\alpha}-1}_{i=0}$ exp $(-2\pi ix_i/L)$, with a similar expression for $y_{cm}$
- The flocking simulation has three times scale defined by the model parameters
    - Self-propulsion time scale  $\tau_{prop}=1/\mu$
    - Flocking time scale $\tau_{flock}=v_0/\alpha$
    - Collision time scale $\tau_{coll}=1/(2r_0v_0\rho)$
- Even distribution between CW and CCW motion when viewed from above, 5% flow CW with the remaining 95% flowing CCW (p < 0.001).

- Periodic Boundary Conditions

# Parameters

| Symbol | Plain-English meaning | Value used in the study |
| --- | --- | --- |
| $N$ | Total number of people in the simulation | 500 |
| $N_a$ | Number of active moshers | 150 |
| $v_0$ | Preferred speed of an active mosher | 1, in the model’s units |
| $v_i$ | Current velocity of person i: speed **and** direction | Changes over time |
| $r_{ij}$ | Distance from the center of person i to person j | Changes as people move |
| $r_0$ | Radius assigned to one simulated person | 1 |
| $\epsilon$ | Strength of the “don’t overlap” push | 100 |
| $\mu$ | How quickly someone returns to their preferred speed | Usually 0.05 |
| $\alpha$ | Strength of the “follow nearby people” effect | Varied from 0 to 5 |
| $r_\text{flock}$ | Radius within which someone notices/follows neighbors | 4 |
| $\eta_i$ | Random disturbance affecting person i | Random; its strength was varied from 0 to 3 |

# Pymunk

Physical Bodies

- `pymunk.Body.STATIC`
Never moves (walls, floors, obstacles)
- `pymunk.Body.DYNAMIC`
Normal physics objects (balls, crates). Affected by gravity and collisions
    - mass
    - inertia (resistance to movement)
    - body_type
- `pymunk.Body.KINEMATIC`
Moves at a velocity you set, ignores gravity, and pushes dynamic objects out of the way (moving platforms, spinning blades).