// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.sps.data.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/investments")
public class InvestmentServlet extends HttpServlet {
  List<Investment> usersInvestments = new ArrayList<>();
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    getUserInvestments();
    response.setContentType("application/json");

    response.getWriter().println(new Gson().toJson(usersInvestments));
  }

  private void getUserInvestments() {
    // hard coded data that will need to be removed
    usersInvestments.add(Investment.create("Bob", "Chicken Wings", 50, new Date(2020, 12, 26).getTime()));
    usersInvestments.add(Investment.create("Jack", "Trump", 25, new Date(2020, 11, 26).getTime()));
    usersInvestments.add(Investment.create("Mary", "COVID", 30, new Date(2020, 10, 26).getTime()));
  }
}
