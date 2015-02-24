package eea.eprtr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.LovCountryRepository;
import eea.eprtr.model.LovCountry;

@RestController
public class LovCountryController {

	private LovCountryRepository repository;
	
	@Autowired
	public LovCountryController(LovCountryRepository repository) {
		this.repository = repository;
	}
	
	@RequestMapping("/lovCountry/{countryCode}")
	public LovCountry get(
			@PathVariable(value = "countryCode") String countryCode) {
		return repository.get(countryCode);
	}
	
}
