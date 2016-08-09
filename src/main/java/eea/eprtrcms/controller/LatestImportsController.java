package eea.eprtrcms.controller;

import eea.eprtr.util.BreadCrumbs;
import eea.eprtrcms.dao.LatestDataImportJdbc;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * List latest imports table.
 */
@Controller
@RequestMapping("/cms")
public class LatestImportsController {

    /**
     * Service for data imports.
     */
    @Autowired
    LatestDataImportJdbc latestDataImportJdbc;

    /**
     * View of all data imports.
     *
     * @param model - contains attributes for the view
     * @param message
     * @return view name
     */
    @RequestMapping("/latestimports")
    public String viewKeys(Model model, @RequestParam(required = false) String message) {
        BreadCrumbs.set(model, "Data imports");
        model.addAttribute("allDataImports", latestDataImportJdbc.getAll());
        if(message != null) model.addAttribute("message", message);
        return "latestimports";
    }

}
