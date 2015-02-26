package eea.eprtr.dao;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;

public class ConfidentialityFilter {

	public Predicate buildWhereClause(CriteriaBuilder cb, Root<FacilitySearchAll> qr) {
		Predicate whereClause = cb.disjunction();
		whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.confidentialIndicatorFacility), Boolean.TRUE));
		return whereClause;
	}

}
