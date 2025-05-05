<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Models\Responsibility;
use Illuminate\Http\Request;
use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateResponsibilityRequest;
use Illuminate\Support\Facades\Storage;

class ResponsibilityController extends Controller
{
    public function create(CreateResponsibilityRequest $request)
    {
        try {
            $responsibility = Responsibility::create([
                'name' => $request->name,
                'role_id' => $request->role_id,
            ]);

            if (!$responsibility) {
                throw new Exception('Responsibility creation failed');
            }

            return ResponseFormatter::success($responsibility, 'Responsibility created successfully');
        } catch (Exception $e) {
            return ResponseFormatter::error($e->getmessage(), '500');
        }
    }


    public function fetch(Request $request)
    {
        $id = $request->input('id');
        $name = $request->input('name');
        $limit = $request->input('limit', 10);

        $responsibilityQuery = Responsibility::query();

        // Get Single Data
        if ($id) {
            $responsibility = $responsibilityQuery->find($id);

            if ($responsibility) {
                return ResponseFormatter::success($responsibility, 'Responsibility found');
            }

            return ResponseFormatter::error('Responsibility not found', 404);
        }

        // Get multiple data
        $responsibilities = $responsibilityQuery->where('role_id', $request->role_id);

        if ($name) {
            $responsibilities->where('name', 'like', '%' . $name . '%');
        }

        return ResponseFormatter::success($responsibilities->paginate($limit), 'Responsibilities found');
    }

    public function delete($id)
    {
        try {
            $responsibility = Responsibility::find($id);

            // TODO : Check if responsibility is owned by the user

            if (!$responsibility) {
                throw new Exception('Responsibility not found');
            }

            $responsibility->delete();

            return ResponseFormatter::success(null, 'Responsibility deleted successfully');
        } catch (Exception $e) {
            return ResponseFormatter::error($e->getMessage(), '500');
        }
    }
}
