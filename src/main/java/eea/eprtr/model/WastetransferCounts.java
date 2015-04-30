package eea.eprtr.model;

public class WastetransferCounts {
	private final long quantityNONHW;
	private final long quantityHWIC;
	private final long quantityHWOC;

	public WastetransferCounts(long quantityNONHW, long quantityHWIC, long quantityHWOC) {
		this.quantityNONHW = quantityNONHW;
		this.quantityHWIC = quantityHWIC;
		this.quantityHWOC = quantityHWOC;
	}

	public long getQuantityNONHW() {
		return quantityNONHW;
	}

	public long getQuantityHWIC() {
		return quantityHWIC;
	}

	public long getQuantityHWOC() {
		return quantityHWOC;
	}

}
