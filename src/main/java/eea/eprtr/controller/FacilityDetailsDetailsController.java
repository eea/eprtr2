package eea.eprtr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.FacilityDetailsDetailsRepository;
import eea.eprtr.model.FacilitydetailDetail;

@RestController
public class FacilityDetailsDetailsController {
	
	private FacilityDetailsDetailsRepository repository;
	
	@Autowired
	public FacilityDetailsDetailsController(FacilityDetailsDetailsRepository repository) {
		this.repository = repository;
	}
	
	@RequestMapping("/facilitydetailDetails/{facilityReportID}")
	public FacilitydetailDetail get(
			@PathVariable(value = "facilityReportID") Integer facilityReportID) {
		return repository.get(facilityReportID);
	}

}
