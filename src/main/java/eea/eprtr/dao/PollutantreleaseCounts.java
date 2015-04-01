package eea.eprtr.dao;

public class PollutantreleaseCounts {

	private final Double quantityAir;
	private final Double quantitySoil;
	private final Double quantityWater;

	public PollutantreleaseCounts(Double quantityAir, Double quantitySoil, Double quantityWater) {
		this.quantityAir = quantityAir;
		this.quantitySoil = quantitySoil;
		this.quantityWater = quantityWater;
	}

	public Double getQuantityAir() {
		return quantityAir;
	}

	public Double getQuantitySoil() {
		return quantitySoil;
	}

	public Double getQuantityWater() {
		return quantityWater;
	}
}
