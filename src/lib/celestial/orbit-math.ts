export class OrbitMath {
  static eccentricAnomaly(M: number, e: number, iterations = 12): number {
    let E = M;
    for (let i = 0; i < iterations; i++) {
      E = M + e * Math.sin(E);
    }
    return E;
  }

  static trueAnomaly(E: number, e: number): number {
    return (
      2 *
      Math.atan2(
        Math.sqrt(1 + e) * Math.sin(E / 2),
        Math.sqrt(1 - e) * Math.cos(E / 2),
      )
    );
  }

  static getPosition(semiMajor: number, eccentricity: number, meanAnomaly: number) {
    if (eccentricity < 0.001) {
      return {
        x: semiMajor * Math.cos(meanAnomaly),
        z: semiMajor * Math.sin(meanAnomaly),
      };
    }

    const E = this.eccentricAnomaly(meanAnomaly, eccentricity);
    const nu = this.trueAnomaly(E, eccentricity);
    const r =
      (semiMajor * (1 - eccentricity * eccentricity)) /
      (1 + eccentricity * Math.cos(nu));

    return {
      x: r * Math.cos(nu),
      z: r * Math.sin(nu),
    };
  }
}
