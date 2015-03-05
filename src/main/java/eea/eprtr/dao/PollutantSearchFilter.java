package eea.eprtr.dao;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;
import eea.eprtr.model.MediumCode;
import eea.eprtr.model.Pollutantrelease;
import eea.eprtr.model.Pollutantrelease_;

public class PollutantSearchFilter {

	private Integer pollutantID;
	private Integer pollutantGroupID;
	private List<MediumCode> mediumCode;
	private Integer accidental;

	public PollutantSearchFilter(Integer pollutantID, Integer pollutantGroupID, List<MediumCode> mediumCode, Integer accidental) {
		this.pollutantID = pollutantID;
		this.pollutantGroupID = pollutantGroupID;
		this.mediumCode = mediumCode;
		this.accidental = accidental;
	}
	
	public Predicate buildWhereClause(CriteriaBuilder cb, Root<FacilitySearchAll> qr) {
		Predicate whereClause = cb.conjunction();
		if (pollutantID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_PollutantID), pollutantID));
		}
		if (pollutantGroupID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_PollutantGroupID), pollutantGroupID));
		}
		if (mediumCode != null) {
			whereClause.getExpressions().add(cb.not(qr.get(FacilitySearchAll_.mediumCode).in(mediumCode)));
		}
		if (accidental != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.accidental), accidental));
		} 
		 
		return whereClause;
	}
	
	public Predicate buildWhereClausePollutantrelease(CriteriaBuilder cb, Root<Pollutantrelease> qr) {
		Predicate whereClause = cb.conjunction();
		if (pollutantID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutantrelease_.LOV_PollutantID), pollutantID));
		}
		if (pollutantGroupID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutantrelease_.LOV_PollutantGroupID), pollutantGroupID));
		}
		if (mediumCode != null) {
			ArrayList<MediumCode> codes = new ArrayList<MediumCode>(Arrays.asList(MediumCode.values()));
			codes.removeAll(mediumCode);
			Predicate mediumCodesWhereClause = cb.disjunction();
			for (MediumCode code : codes) {
				switch (code) {
				case AIR:
					mediumCodesWhereClause.getExpressions().add(qr.get(Pollutantrelease_.quantityAir).isNotNull());
					break;
				case LAND:
					mediumCodesWhereClause.getExpressions().add(qr.get(Pollutantrelease_.quantitySoil).isNotNull());
					break;
				case WATER:
					mediumCodesWhereClause.getExpressions().add(qr.get(Pollutantrelease_.quantityWater).isNotNull());
					break;
				default:
				}
			}
			if (mediumCodesWhereClause.getExpressions().size() > 0) {
				whereClause.getExpressions().add(mediumCodesWhereClause);
			}
		}
		return whereClause;
	}
}
