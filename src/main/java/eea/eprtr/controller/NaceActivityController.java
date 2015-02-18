package eea.eprtr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.NaceActivityRepository;
import eea.eprtr.model.NaceActivity;

@RestController
public class NaceActivityController {

	private NaceActivityRepository repository;
	
	@Autowired
	public NaceActivityController(NaceActivityRepository repository) {
		this.repository = repository;
	}

	@RequestMapping("/naceActivity")
	public List<NaceActivity> list(
			@RequestParam(value = "ParentID", required = false) Integer parentID) {
		return repository.list(parentID);
	}
}
