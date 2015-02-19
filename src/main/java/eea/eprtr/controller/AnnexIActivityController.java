package eea.eprtr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.AnnexIActivityRepository;
import eea.eprtr.model.AnnexIActivity;

@RestController
public class AnnexIActivityController {

	private AnnexIActivityRepository repository;
	
	@Autowired
	public AnnexIActivityController(AnnexIActivityRepository repository) {
		this.repository = repository;
	}

	@RequestMapping("/annexIActivity")
	public List<AnnexIActivity> list(
			@RequestParam(value = "ParentID", required = false) Integer parentID) {
		return repository.list(parentID);
	}
}
