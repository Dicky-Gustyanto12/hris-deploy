<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use App\Helpers\ResponseFormatter;
use App\Http\Requests\CreateCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use Exception;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CompanyController extends Controller
{

    public function index(Request $request)
    {
        // Ambil semua data perusahaan
        $companies = Company::with('users')->get();

        // Mengembalikan respons menggunakan ResponseFormatter
        return ResponseFormatter::success($companies, 'Data perusahaan berhasil diambil');
    }

    public function create(CreateCompanyRequest $request)
    {
        try {
            if ($request->hasFile('logo')) {
                $path = $request->file('logo')->store('public/logos');
            }

            $company = Company::create([
                'name' => $request->name,
                'logo' => isset($path) ? $path : '',
            ]);

            if (!$company) {
                throw new Exception('Company creation failed');
            }


            // Attach company to user
            $user = User::find(Auth::id());
            $user->companies()->attach($company->id);

            // Load user
            $company->load('users');

            return ResponseFormatter::success($company, 'Company created successfully');
        } catch (Exception $e) {
            return ResponseFormatter::error($e->getmessage(), '500');
        }
    }

    public function update(UpdateCompanyRequest $request, $id)
    {
        try {
            $company = Company::find($id);

            if (!$company) {
                throw new Exception('Company not found');
            }

            $data = [
                'name' => $request->name,
            ];

            // Upload Logo (opsional)
            if ($request->hasFile('logo')) {
                $path = $request->file('logo')->store('public/logos');
                $data['logo'] = $path;
            }

            // Update Company
            $company->update($data);

            return ResponseFormatter::success($company, 'Company updated successfully');
        } catch (Exception $e) {
            return ResponseFormatter::error($e->getMessage(), '500');
        }
    }

    public function fetch(Request $request)
    {
        $id = $request->input('id');
        $name = $request->input('name');
        $limit = $request->input('limit', 10);

        if ($id) {
            $company = Company::with(['users'])->whereHas('users', function ($query) {
                $query->where('user_id', Auth::id());
            })->find($id);

            if ($company) {
                return ResponseFormatter::success($company, 'Company found');
            }

            return ResponseFormatter::error('Company not found', 404);
        }

        $companies = Company::with(['users'])->whereHas('users', function ($query) {
            $query->where('user_id', Auth::id());
        });

        if ($name) {
            $companies->where('name', 'like', '%' . $name . '%');
        }
        return ResponseFormatter::success($companies->get(), 'Company found');
    }
}
