package eea.eprtr.dao;

import javax.persistence.criteria.AbstractQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Root;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;

public class FacilitySearchFilter {

	private Integer reportingYear;

	public FacilitySearchFilter(Integer reportingYear) {
		this.reportingYear = reportingYear;
	}

	public void apply(CriteriaBuilder cb, AbstractQuery<?> cq, Root<FacilitySearchAll> qr) {
		cq.where(cb.equal(qr.get(FacilitySearchAll_.reportingYear), reportingYear));
	}
}
