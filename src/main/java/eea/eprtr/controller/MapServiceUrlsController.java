package eea.eprtr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.MapServiceUrlsRepository;
import eea.eprtr.model.MapServiceUrls;

@RestController
public class MapServiceUrlsController {

	@Autowired
	private MapServiceUrlsRepository mapServiceUrlsRepository;

	@RequestMapping("/mapurls")
    public MapServiceUrls getMapServiceUrls() {
		MapServiceUrls msu = mapServiceUrlsRepository.getMapUrls();
		return msu;
    }
}