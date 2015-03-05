package eea.eprtr.dao;

public class PollutantreleaseCounts {

	private final long quantityAir;
	private final long quantitySoil;
	private final long quantityWater;

	public PollutantreleaseCounts(long quantityAir, long quantitySoil, long quantityWater) {
		this.quantityAir = quantityAir;
		this.quantitySoil = quantitySoil;
		this.quantityWater = quantityWater;
	}

	public long getQuantityAir() {
		return quantityAir;
	}

	public long getQuantitySoil() {
		return quantitySoil;
	}

	public long getQuantityWater() {
		return quantityWater;
	}
}
