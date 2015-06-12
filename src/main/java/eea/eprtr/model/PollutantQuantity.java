package eea.eprtr.model;

import java.io.Serializable;

public class PollutantQuantity implements Serializable,Cloneable{
	private static final long serialVersionUID = 1L;

	private Integer lov_pollutantid;
	private String pollutantcode;
	private Long facilities;
	private Double quantityair;
	private Double quantitywater;
	private Double quantitysoil;
	private Double quantity;

	public PollutantQuantity(Integer lov_pollutantid, String pollutantcode, Long facilities, Double quantityair, Double quantitywater, Double quantitysoil, Double quantity){
		this.lov_pollutantid = lov_pollutantid;
		this.pollutantcode = pollutantcode;
		this.facilities = facilities;
		this.quantityair = quantityair;
		this.quantitywater = quantitywater;
		this.quantitysoil = quantitysoil;
		this.quantity = quantity;
	}

	public Integer getLov_pollutantid() {
		return lov_pollutantid;
	}

	public String getPollutantCode() {
		return pollutantcode;
	}

	public Long getFacilities() {
		return facilities;
	}

	public void  setFacilities(Long facilities) {
		this.facilities = facilities;
	}

	public void  AddOneFacility() {
		this.facilities += 1;
	}

	public Double getQuantityAir() {
		return quantityair;
	}

	public void  setQuantityAir(Double quantity) {
		this.quantityair = quantity;
	}

	public void appendToQuantityAir(Double quantity) {
		if (quantity != null){
			this.quantityair += quantity;
		}
	}

	public Double getQuantityWater() {
		return quantitywater;
	}

	public void  setQuantityWater(Double quantity) {
		this.quantitywater = quantity;
	}

	public void appendToQuantityWater(Double quantity) {
		if (quantity != null){
			this.quantitywater += quantity;
		}
	}

	public Double getQuantitySoil() {
		return quantitysoil;
	}

	public void  setQuantitySoil(Double quantity) {
		this.quantitysoil = quantity;
	}

	public void appendToQuantitySoil(Double quantity) {
		if (quantity != null){
			this.quantitysoil += quantity;
		}
	}

	public Double getQuantity() {
		return quantity;
	}

	public void  setQuantity(Double quantity) {
		this.quantity = quantity;
	}

	public void appendToQuantity(Double quantity) {
		if (quantity != null){
			this.quantity += quantity;
		}
	}

	public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

}
