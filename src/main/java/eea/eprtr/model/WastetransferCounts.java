package eea.eprtr.model;

public class WastetransferCounts {
	private final Double quantityNONHW;
	private final Double quantityHWIC;
	private final Double quantityHWOC;

	public WastetransferCounts(Double quantityNONHW, Double quantityHWIC, Double quantityHWOC) {
		this.quantityNONHW = quantityNONHW;
		this.quantityHWIC = quantityHWIC;
		this.quantityHWOC = quantityHWOC;
	}

	public Double getQuantityNONHW() {
		return quantityNONHW;
	}

	public Double getQuantityHWIC() {
		return quantityHWIC;
	}

	public Double getQuantityHWOC() {
		return quantityHWOC;
	}

}
