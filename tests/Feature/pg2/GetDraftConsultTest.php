<?php
/**
 * Created by Teepop Ueangsawat
 * Description=> Test case for get list of user function
 * Unit Test ID=> UTC-07
 */

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class GetDraftConsultTest extends TestCase
{
    use WithoutMiddleware;
    use DatabaseTransactions;

    public function testGetDraftConsultTest()
    {
//        $response = $this->json('POST', 'api/auth/login', [
//            'username' => 'nurse1',
//            'password' => 'nurse1'
//        ]);
//        $login_obj = $response->getOriginalContent();
//        $token = $login_obj['token'];
//
//        $response = $this->json('GET', 'api/consults/draft?token=' . $token);
        $response = $this->json('GET', 'api/consults/draft/3333333333333');

        $response->assertJson([
            "consults" => [
                [
                    "consult_id" => "aaaaaaaaaaaaa",
                    "user_id" => "3333333333333",
                    "status" => "draft",
                    "patient_firstname" => "Chutikan",
                    "patient_lastname" => "Meeluck",
                    "patient_dob" => "1986-04-14",
                    "patient_gender" => "Male",
                    "patient_address" => "239 Huaykaew Rd., Suthep, Muang, Chiang Mai",
                    "primary_doctor" => "Dr. James Gordon",
                    "health_condition" => "diabetes",
                    "med_hn" => "61223",
                    "med_dx" => "DM",
                    "med_bw" => "65",
                    "med_bmi" => "26.6",
                    "med_t" => "37",
                    "med_fbs" => "100",
                    "med_cr" => "0.43",
                    "med_clearance" => "122.1",
                    "med_stage" => "1",
                    "rec01_date" => "2014-05-10",
                    "rec01_fbs" => "100",
                    "rec01_bp1" => "200/90",
                    "rec01_bp2" => "110/90",
                    "rec01_p" => "120",
                    "rec02_date" => "2014-06-10",
                    "rec02_fbs" => "130/76",
                    "rec02_bp1" => "110/80",
                    "rec02_bp2" => "120/80",
                    "rec02_p" => "70",
                    "consult_complain" => "FBS >= 130 mg%",
                    "consult_plan" => "Slmvas 1209 1/2 x ns",
                    "consult_order" => ""
                ]
            ]
        ]);
    }
}
