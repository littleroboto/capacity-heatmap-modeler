# One unified intensity model for both modes

Subtractive and Additive modes are implemented as a **single compute path** that
produces a Load Intensity in `[0, 1+]` per Cell; the modes differ only in what
sets the Reference (full-red point): Effective Capacity in Subtractive mode, a
Normalisation Max in Additive mode. We chose this over two separate engines so
the renderer, colour ramp, roll-ups, and faceting are written once.

## Consequences

- "Capacity", "Reducer", and true overload (`>1.0`) exist only when a Reference
  of type Effective Capacity is present (Subtractive). Additive intensity is
  relative and has no meaningful overload.
- Switching a Scenario between modes changes only how the Reference is derived,
  not how Consumers or the render work.
