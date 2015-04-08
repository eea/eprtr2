package eea.eprtr.dao;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;
import eea.eprtr.model.Pollutantrelease;
import eea.eprtr.model.Pollutantrelease_;
import eea.eprtr.model.Pollutanttransfer;
import eea.eprtr.model.Pollutanttransfer_;

public class LocationSearchFilter {

	private CountryAreaGroupRepository repository;
	private Integer countryID;
	private Integer areaGroupID;
	private Integer regionID;
	private Integer rbdID;

	public LocationSearchFilter(
			CountryAreaGroupRepository repository,
			Integer countryID, 
			Integer areaGroupID, 
			Integer regionID,
			Integer rbdID) {
		this.repository = repository;
		this.countryID = countryID;
		this.areaGroupID = areaGroupID;
		this.regionID = regionID;
		this.rbdID = rbdID;
	}

	public Predicate buildWhereClause(CriteriaBuilder cb, Root<FacilitySearchAll> qr) {
		Predicate whereClause = cb.conjunction();
		if (areaGroupID != null) {
			List<Integer> countryIDs = repository.getCountryIDs(areaGroupID);
			whereClause.getExpressions().add(qr.get(FacilitySearchAll_.LOV_CountryID).in(countryIDs));
		} else if (countryID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_CountryID), countryID));
			if (regionID != null) {
				whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_NUTSRLevel2ID), regionID));
			} else if (rbdID != null) {
				whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_RiverBasinDistrictID), rbdID));
			}
		}
		return whereClause;
	}
	
	public Predicate buildWhereClausePollutantrelease(CriteriaBuilder cb, Root<Pollutantrelease> qr) {
		Predicate whereClause = cb.conjunction();
		if (areaGroupID != null) {
			List<Integer> countryIDs = repository.getCountryIDs(areaGroupID);
			whereClause.getExpressions().add(qr.get(Pollutantrelease_.LOV_CountryID).in(countryIDs));
		} else if (countryID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutantrelease_.LOV_CountryID), countryID));
			if (regionID != null) {
				whereClause.getExpressions().add(cb.equal(qr.get(Pollutantrelease_.LOV_NUTSRLevel2ID), regionID));
			} else if (rbdID != null) {
				whereClause.getExpressions().add(cb.equal(qr.get(Pollutantrelease_.LOV_RiverBasinDistrictID), rbdID));
			}
		}
		return whereClause;
	}
	
	public Predicate buildWhereClausePollutanttransfer(CriteriaBuilder cb, Root<Pollutanttransfer> qr) {
		Predicate whereClause = cb.conjunction();
		if (areaGroupID != null) {
			List<Integer> countryIDs = repository.getCountryIDs(areaGroupID);
			whereClause.getExpressions().add(qr.get(Pollutanttransfer_.LOV_CountryID).in(countryIDs));
		} else if (countryID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutanttransfer_.LOV_CountryID), countryID));
			if (regionID != null) {
				whereClause.getExpressions().add(cb.equal(qr.get(Pollutanttransfer_.LOV_NUTSRLevel2ID), regionID));
			} else if (rbdID != null) {
				whereClause.getExpressions().add(cb.equal(qr.get(Pollutanttransfer_.LOV_RiverBasinDistrictID), rbdID));
			}
		}
		return whereClause;
	}
	
}
