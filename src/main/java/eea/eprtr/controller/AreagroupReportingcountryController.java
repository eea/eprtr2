package eea.eprtr.controller;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.AreagroupReportingcountry;

@RestController
public class AreagroupReportingcountryController {

	@PersistenceContext
    private EntityManager em;
	
	@RequestMapping("/areagroupReportingCountries")
    public AreagroupReportingcountry[] getAreagroupReportingCountries() {
		
		TypedQuery<AreagroupReportingcountry> query = em.createNamedQuery("AreagroupReportingcountry.findAll", AreagroupReportingcountry.class);
		return query.getResultList().toArray(new AreagroupReportingcountry[0]);
		
		/*TypedQuery<Reportingcountry> query = em.createQuery("SELECT r FROM Reportingcountry r", Reportingcountry.class);
		return query.getResultList();//.toArray(new Reportingcountry[0]);*/
    }
}
