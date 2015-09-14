package eea.eprtr.dao;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.LocationList;
import eea.eprtr.model.LovAreagroup;
import eea.eprtr.model.LovAreagroup_;
import eea.eprtr.model.Reportingcountry;
import eea.eprtr.model.Reportingcountry_;

@Repository
public class AreaGroupReportingCountriesRepository {

	
	@PersistenceContext(unitName="eprtr")
    private EntityManager em;

	public List<LocationList> getAreaGroupReportingCountries() {
		// TODO Auto-generated method stub
		
		/*Area groups*/
		CriteriaBuilder cb1 = em.getCriteriaBuilder();
		CriteriaQuery<LovAreagroup> cq1 = cb1.createQuery(LovAreagroup.class);
		Root<LovAreagroup> qr1 = cq1.from(LovAreagroup.class);
		cq1.select(qr1);
		cq1.orderBy(cb1.asc(qr1.get(LovAreagroup_.LOV_AreaGroupID)));
		TypedQuery<LovAreagroup> q1 = em.createQuery(cq1);
		List<LovAreagroup> areagroups = q1.getResultList();
		
		/*Countries*/
		CriteriaBuilder cb2 = em.getCriteriaBuilder();
		CriteriaQuery<Reportingcountry> cq2 = cb2.createQuery(Reportingcountry.class);
		Root<Reportingcountry> qr2 = cq2.from(Reportingcountry.class);
		cq2.select(qr2);
		cq2.orderBy(cb2.asc(qr2.get(Reportingcountry_.LOV_CountryID)));
		TypedQuery<Reportingcountry> q2 = em.createQuery(cq2);
		List<Reportingcountry> countries = q2.getResultList();
		
		int _coun = 0;
		List<LocationList> locationList = new ArrayList<LocationList>();
		for (int i =0; i < areagroups.size(); i++){
			LovAreagroup ag = areagroups.get(i);
			locationList.add( new LocationList(_coun, ag.getLOV_AreaGroupID(), null, ag.getName()));
			_coun ++;
		}
		for (int i =0; i < countries.size(); i++){
			Reportingcountry co = countries.get(i);
			locationList.add( new LocationList(_coun, null, co.getLOV_CountryID(), co.getName()));
			_coun ++;
		}

		/*
		 * SELECT [LOV_AreaGroupID] AS GroupId, NULL AS CountryId, [Name] FROM [dbo].[LOV_AREAGROUP] 
UNION ALL
SELECT NULL AS GroupId, [LOV_CountryID] AS CountryId, [Name] FROM [dbo].[REPORTINGCOUNTRY] --) a;
		 */
		return locationList;
	}

}
