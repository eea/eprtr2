package eea.eprtr.controller;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.NaceActivityRepository;
import eea.eprtr.model.NaceActivity;

@RestController
public class NaceActivityController {

	private NaceActivityRepository repository;
	
	@PersistenceContext(unitName="eprtr")
    private EntityManager em;

	@Autowired
	public NaceActivityController(NaceActivityRepository repository) {
		this.repository = repository;
	}

	@RequestMapping("/naceActivity")
	public List<NaceActivity> list(
			@RequestParam(value = "ParentID", required = false) Integer parentID) {
			return repository.list(parentID);
		}

	@RequestMapping("/naceActivity/{id}")
	public NaceActivity get(
		@PathVariable(value = "id") Integer id) {
			return repository.get(id);
	}
}
