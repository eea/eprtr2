package eea.eprtr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.LovNutsregionRepository;
import eea.eprtr.model.LovNutsregion;

@RestController
public class LovNutsregionController {

	private LovNutsregionRepository repository;
	
	@Autowired
	public LovNutsregionController(LovNutsregionRepository repository) {
		this.repository = repository;
	}
	
	@RequestMapping("/nutsRegion/{code}")
	public LovNutsregion get(
			@PathVariable(value = "code") String code) {
		return repository.get(code);
	}
	
}
