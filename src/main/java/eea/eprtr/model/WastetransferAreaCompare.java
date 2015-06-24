package eea.eprtr.model;

public class WastetransferAreaCompare {
	private final Integer reportingYear;
	private final String area;
	private Long facilities;
	private Long facilitiesAnnexI;
	private  Double quantityTotal;
	private  Double quantityTotalAnnexI;
	private  Double quantityRecovery;
	private  Double quantityRecoveryAnnexI;
	private  Double quantityDisposal;
	private  Double quantityDisposalAnnexI;
	private  Double quantityUnspec;
	private  Double quantityUnspecAnnexI;
	private  Double pctTotal;
	private  Double pctTotalAnnexI;
	private  Double pctRecovery;
	private  Double pctRecoveryAnnexI;
	private  Double pctDisposal;
	private  Double pctDisposalAnnexI;
	private  Double pctUnspec;
	private  Double pctUnspecAnnexI;

	/*	public WastetransferAreaCompare(Integer reportingYear, String area, Long facilities, Long facilitiesAnnexI, 
			Double quantityTotal, Double quantityTotalAnnexI, 
			Double quantityRecovery, Double quantityRecoveryAnnexI,
			Double quantityDisposal, Double quantityDisposalAnnexI, 
			Double quantityUnspec, Double quantityUnspecAnnexI)*/
	public WastetransferAreaCompare(Integer reportingYear, String area, Long facilities,  
			Double quantityTotal,  
			Double quantityRecovery, 
			Double quantityDisposal,  
			Double quantityUnspec) {
		this.reportingYear = reportingYear;
		this.area = area;
		this.facilities = facilities;
		//this.facilitiesAnnexI = facilitiesAnnexI;
		this.quantityTotal = quantityTotal;
		//this.quantityTotalAnnexI = quantityTotalAnnexI;
		this.quantityRecovery = quantityRecovery;
		//this.quantityRecoveryAnnexI = quantityRecoveryAnnexI;
		this.quantityDisposal = quantityDisposal;
		//this.quantityDisposalAnnexI = quantityDisposalAnnexI;
		this.quantityUnspec = quantityUnspec;
		//this.quantityUnspecAnnexI = quantityUnspecAnnexI;
	}

	public Integer getReportingYear() {
		return reportingYear;
	}

	public String getArea() {
		return area;
	}

	public Long getFacilities() {
		return facilities;
	}

	public void setFacilities(Long facilities) {
		this.facilities = facilities;
	}
	
	public void appendFacilities(Long facilities) {
		this.facilities += facilities;
	}

	public Long getFacilitiesAnnexI() {
		return facilitiesAnnexI;
	}

	public void setFacilitiesAnnexI(Long facilities) {
		this.facilitiesAnnexI = facilities;
	}

	public void appendFacilitiesAnnexI(Long facilities) {
		this.facilitiesAnnexI += facilities;
	}

	/*TOTAL*/
	
	public Double getQuantityTotal() {
		return (quantityTotal != null)? quantityTotal:0.0;
	}

	public void setQuantityTotal(Double quantity) {
		this.quantityTotal = quantity;
	}

	public void appendQuantityTotal(Double quantity) {
		this.quantityTotal += quantity;
	}

	public Double getQuantityTotalAnnexI() {
		return (quantityTotalAnnexI != null)? quantityTotalAnnexI:0.0;
	}
	
	public void setQuantityTotalAnnexI(Double quantity) {
		this.quantityTotalAnnexI = quantity;
	}

	public void appendQuantityTotalAnnexI(Double quantity) {
		this.quantityTotalAnnexI += quantity;
	}

	public Double getPctTotal() {
		return (pctTotal != null)? pctTotal:0.0;
	}

	public void setPctTotal(Double pct) {
		this.pctTotal = pct;
	}

	public Double getPctTotalAnnexI() {
		return (pctTotalAnnexI != null)? pctTotalAnnexI:0.0;
	}
	
	public void setPctTotalAnnexI(Double pct) {
		this.pctTotalAnnexI = pct;
	}

	/*RECOVERY*/

	public Double getQuantityRecovery() {
		return (quantityRecovery != null)? quantityRecovery:0.0; 
	}
	
	public void setQuantityRecovery(Double quantity) {
		this.quantityRecovery = quantity;
	}

	public void appendQuantityRecovery(Double quantity) {
		this.quantityRecovery += quantity;
	}
	
	public Double getQuantityRecoveryAnnexI() {
		return (quantityRecoveryAnnexI != null)? quantityRecoveryAnnexI:0.0; 
	}

	public void setQuantityRecoveryAnnexI(Double quantity) {
		this.quantityRecoveryAnnexI = quantity;
	}

	public void appendQuantityRecoveryAnnexI(Double quantity) {
		this.quantityRecoveryAnnexI += quantity;
	}
	
	public Double getPctRecovery() {
		return (pctRecovery != null)? pctRecovery:0.0;
	}

	public void setPctRecovery(Double pct) {
		this.pctRecovery = pct;
	}

	public Double getPctRecoveryAnnexI() {
		return (pctRecoveryAnnexI != null)? pctRecoveryAnnexI:0.0;
	}
	
	public void setPctRecoveryAnnexI(Double pct) {
		this.pctRecoveryAnnexI = pct;
	}
	
	/*DISPOSAL*/

	public Double getQuantityDisposal() {
		return (quantityDisposal != null)? quantityDisposal:0.0; 
	}
	
	public void setQuantityDisposal(Double quantity) {
		this.quantityDisposal = quantity;
	}

	public void appendQuantityDisposal(Double quantity) {
		this.quantityDisposal += quantity;
	}
	
	public Double getQuantityDisposalAnnexI() {
		return (quantityDisposalAnnexI != null)? quantityDisposalAnnexI:0.0; 
	}

	public void setQuantityDisposalAnnexI(Double quantity) {
		this.quantityDisposalAnnexI = quantity;
	}

	public void appendQuantityDisposalAnnexI(Double quantity) {
		this.quantityDisposalAnnexI += quantity;
	}
	
	public Double getPctDisposal() {
		return (pctDisposal != null)? pctDisposal:0.0;
	}

	public void setPctDisposal(Double pct) {
		this.pctDisposal = pct;
	}

	public Double getPctDisposalAnnexI() {
		return (pctDisposalAnnexI != null)? pctDisposalAnnexI:0.0;
	}
	
	public void setPctDisposalAnnexI(Double pct) {
		this.pctDisposalAnnexI = pct;
	}
	/*UNSPEC*/
	
	public Double getQuantityUnspec() {
		return (quantityUnspec != null)? quantityUnspec:0.0;
	}
	
	public void setQuantityUnspec(Double quantity) {
		this.quantityUnspec = quantity;
	}

	public void appendQuantityUnspec(Double quantity) {
		this.quantityUnspec += quantity;
	}
	
	public Double getQuantityUnspecAnnexI() {
		return (quantityUnspecAnnexI != null)? quantityUnspecAnnexI:0.0;
	}

	public void setQuantityUnspecAnnexI(Double quantity) {
		this.quantityUnspecAnnexI = quantity;
	}

	public void appendQuantityUnspecAnnexI(Double quantity) {
		this.quantityUnspecAnnexI += quantity;
	}

	public Double getPctUnspec() {
		return (pctUnspec != null)? pctUnspec:0.0;
	}

	public void setPctUnspec(Double pct) {
		this.pctUnspec = pct;
	}

	public Double getPctUnspecAnnexI() {
		return (pctUnspecAnnexI != null)? pctUnspecAnnexI:0.0;
	}
	
	public void setPctUnspecAnnexI(Double pct) {
		this.pctUnspecAnnexI = pct;
	}
}
